import type { VintageHallApp as App } from './app';
import type { Lang } from '../types';
import { supabase } from '../lib/supabase';

/** Live marketplace layer — syncs bids through Supabase so every visitor sees the same
    auction state, updated in real time. Everything here is strictly additive and defensive:
    with no Supabase project configured, or the network/tables/auth unavailable, every call
    silently no-ops and the app keeps its original local-demo behaviour. */

declare module './app' {
  interface VintageHallApp {
    initLive(): void;
    ensureAuthProfile(name: string): Promise<void>;
    pushBidRemote(productId: number, amount: number): void;
    outbidLabel(): string;
    remoteBidderLabel(): string;
  }
}

/** Supabase auth user id for this browser session (anonymous sign-in), once known. */
let liveUserId: string | null = null;
interface BidRow { product_id: number; bidder_id: string | null; amount: number }

export const liveMethods = {
  outbidLabel(this: App): string {
    const map: Record<Lang, string> = {
      uk: 'Вашу ставку перебили!', en: 'You have been outbid!',
      pl: 'Twoja oferta została przebita!', ru: 'Вашу ставку перебили!',
    };
    return map[this.currentLang];
  },

  remoteBidderLabel(this: App): string {
    const map: Record<Lang, string> = {
      uk: 'Інший учасник', en: 'Another bidder', pl: 'Inny licytujący', ru: 'Другой участник',
    };
    return map[this.currentLang];
  },

  initLive(this: App): void {
    if (!supabase) return;
    const sb = supabase;

    void (async () => {
      // Restore the anonymous session if this browser already has one.
      try {
        const { data } = await sb.auth.getSession();
        liveUserId = data.session?.user?.id ?? null;
      } catch { /* ignore */ }

      // A returning visitor restored from localStorage may still need their auth backing.
      if (this.currentUser) void this.ensureAuthProfile(this.currentUser);

      // Pull shared bid state and overlay it onto the seeded demo data, so a visitor
      // immediately sees bids placed by everyone else, not just their own localStorage.
      try {
        const { data: bids, error } = await sb
          .from('bids')
          .select('product_id, amount')
          .order('amount', { ascending: false });
        if (!error && bids?.length) {
          const top = new Map<number, { max: number; count: number }>();
          for (const b of bids as BidRow[]) {
            const cur = top.get(b.product_id);
            if (cur) { cur.count += 1; if (b.amount > cur.max) cur.max = b.amount; }
            else top.set(b.product_id, { max: b.amount, count: 1 });
          }
          let changed = false;
          top.forEach((v, productId) => {
            const p = this.products.find(x => x.id === productId);
            if (!p || p.saleType !== 'auction') return;
            if (v.max > (p.currentBid ?? p.startPrice ?? 0)) {
              p.currentBid = v.max;
              p.bidsCount = Math.max(p.bidsCount ?? 0, v.count);
              changed = true;
            }
          });
          if (changed) {
            this.renderCatalog();
            this.renderLiveAuctions();
          }
        }
      } catch { /* offline / tables missing — demo data stands */ }

      // Realtime: any bid inserted by any visitor updates this page immediately.
      try {
        sb.channel('vh-live-bids')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids' }, (payload) => {
            const row = payload.new as BidRow;
            if (!row?.product_id) return;
            if (row.bidder_id && row.bidder_id === liveUserId) return; // own echo — already applied locally
            const p = this.products.find(x => x.id === row.product_id);
            if (!p || p.saleType !== 'auction') return;
            if (row.amount <= (p.currentBid ?? p.startPrice ?? 0)) return;

            const hadTopBid = !!this.currentUser && p.bidHistory?.[0]?.user === this.currentUser;
            p.currentBid = row.amount;
            p.bidsCount = (p.bidsCount ?? 0) + 1;
            p.bidHistory = [
              { user: this.remoteBidderLabel(), bid: row.amount, time: new Date().toISOString() },
              ...(p.bidHistory ?? []),
            ];
            this.renderCatalog();
            this.renderLiveAuctions();
            if (this.currentLotDetailId === p.id && document.getElementById('checkoutModal')?.classList.contains('active')) {
              this.openLotDetail(p.id);
            }
            if (hadTopBid) {
              this.showToast(`⚡ ${this.outbidLabel()} <span class="mono">${row.amount.toLocaleString('uk-UA')} ₴</span>`);
            }
          })
          .subscribe();
      } catch { /* realtime unavailable — polling-free demo mode */ }
    })();
  },

  /** Called after the demo name-login: backs the visitor with a real (anonymous) Supabase
      auth user + profile row, which RLS requires for writing bids. */
  async ensureAuthProfile(this: App, name: string): Promise<void> {
    if (!supabase) return;
    const sb = supabase;
    try {
      let userId = liveUserId;
      if (!userId) {
        const { data: sess } = await sb.auth.getSession();
        userId = sess.session?.user?.id ?? null;
      }
      if (!userId) {
        const { data, error } = await sb.auth.signInAnonymously();
        if (error || !data.user) return; // anonymous sign-ins disabled — stay local
        userId = data.user.id;
      }
      liveUserId = userId;
      await sb.from('profiles').upsert({ id: userId, display_name: name }, { onConflict: 'id' });
    } catch { /* stay in local demo mode */ }
  },

  /** Fire-and-forget mirror of a locally placed bid into the shared bids table. */
  pushBidRemote(this: App, productId: number, amount: number): void {
    if (!supabase || !liveUserId) return;
    void supabase
      .from('bids')
      .insert({ product_id: productId, bidder_id: liveUserId, amount })
      .then(({ error }) => {
        if (error) console.warn('[live] bid not synced:', error.message);
      });
  },
};
