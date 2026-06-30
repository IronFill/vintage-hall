import type { VintageHallApp as App } from './app';
import { $ } from './dom-utils';
import { MATERIAL_BY_ICON, ICON_PATHS, SELLERS, RECENT_SALES } from '../data/products';
import { UI } from '../data/i18n';
import type { Product, CatalogFilter, Badge, Rarity, SortMode, Category } from '../types';

/** Formats milliseconds left until an auction's end as "Дд ГГ:ХХ:СС" (or just HH:MM:SS under a day). */
function formatTimeLeft(ms: number): string {
  if (ms <= 0) return '';
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return days > 0 ? `${days}д ${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

declare module './app' {
  interface VintageHallApp {
  materialOf(p: Product): string;
  goToCategory(cat: CatalogFilter): void;
  populateFilters(): void;
  loadFiltersFromUrl(): void;
  syncFiltersToUrl(): void;
  renderCatalog(): void;
  badgeLabel(badge: Badge): string;
  rarityLabel(rarity: Rarity): string;
  rarityDot(p: Product): { color: string; label: string } | null;
  sellerLine(seller: string): string;
  renderCard(p: Product): string;
  tickTimers(): void;
  toggleFavorite(id: number): void;
  toggleFollowSeller(sellerName: string): void;
  saveFollowedSellers(): void;
  toggleCompare(id: number): void;
  clearCompare(): void;
  renderCompareBar(): void;
  openCompareModal(): void;
  closeCompareModal(): void;
  renderActivityStrip(): void;
  renderRecentSalesFeed(): void;
  renderLiveAuctions(): void;
  matchSavedSearchCount(category: CatalogFilter, query: string): number;
  saveCurrentSearch(): void;
  applySavedSearch(id: string): void;
  removeSavedSearch(id: string): void;
  saveSavedSearches(): void;
  }
}

export const catalogMethods = {
  materialOf(this: App, p: Product): string {
    return p.custom?.material || MATERIAL_BY_ICON[p.icon][this.currentLang];
  },
  /** Used by the Collections tiles (#10): jumps straight into a filtered catalog view. */
  goToCategory(this: App, cat: CatalogFilter): void {
    this.activeCat = cat;
    document.querySelectorAll('#sidebarTabs .tab').forEach(el => el.classList.toggle('active', (el as HTMLElement).dataset.cat === cat));
    this.renderCatalog();
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
  populateFilters(this: App): void {
    const originSelect = document.getElementById('filterOrigin') as HTMLSelectElement | null;
    if (!originSelect) return;
    const origins = Array.from(new Set(this.products.map(p => p.origin).filter(Boolean))) as string[];
    origins.sort();
    originSelect.innerHTML = `<option value="">— ${this.t('filter_origin')} (${this.t('filter_any')}) —</option>` +
      origins.map(o => `<option value="${o}">${o}</option>`).join('');
    originSelect.value = this.originFilter;

    const materialSelect = document.getElementById('filterMaterial') as HTMLSelectElement | null;
    if (materialSelect) {
      const materials = Array.from(new Set(this.products.map(p => this.materialOf(p)).filter(Boolean)));
      materials.sort();
      materialSelect.innerHTML = `<option value="">— ${this.t('filter_material')} (${this.t('filter_any')}) —</option>` +
        materials.map(m => `<option value="${m}">${m}</option>`).join('');
      materialSelect.value = this.materialFilter;
    }

    const raritySelect = document.getElementById('filterRarity') as HTMLSelectElement | null;
    if (raritySelect) raritySelect.value = this.rarityFilter;
  },
  loadFiltersFromUrl(this: App): void {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) this.activeCat = cat as CatalogFilter;
    const origin = params.get('origin');
    if (origin) this.originFilter = origin;
    const material = params.get('material');
    if (material) this.materialFilter = material;
    const rarity = params.get('rarity');
    if (rarity) this.rarityFilter = rarity;
    const mode = params.get('mode');
    if (mode === 'shop' || mode === 'auction') this.catalogMode = mode;
    const q = params.get('q');
    if (q) this.searchQuery = q;
    const sort = params.get('sort');
    if (sort) this.sortMode = sort as SortMode;
    const fav = params.get('fav');
    if (fav) fav.split(',').forEach(idStr => { const n = parseInt(idStr, 10); if (!isNaN(n)) this.favorites.add(n); });

    const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
    if (searchInput && this.searchQuery) searchInput.value = this.searchQuery;
    const sortSel = document.getElementById('sortSelect') as HTMLSelectElement | null;
    if (sortSel && this.sortMode !== 'default') sortSel.value = this.sortMode;
    if (this.catalogMode !== 'all') {
      document.querySelectorAll<HTMLElement>('#modeToggle button').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === this.catalogMode);
      });
    }
    document.querySelectorAll<HTMLElement>('#sidebarTabs .tab').forEach(el => {
      el.classList.toggle('active', el.dataset.cat === this.activeCat);
    });
  },
  /** Keeps the URL in sync with the current filters (replaceState — no extra history entries). */
  syncFiltersToUrl(this: App): void {
    if (!document.getElementById('catalogGrid')) return; // only the homepage has a catalog to filter
    const params = new URLSearchParams();
    if (this.activeCat !== 'all') params.set('category', this.activeCat);
    if (this.originFilter) params.set('origin', this.originFilter);
    if (this.materialFilter) params.set('material', this.materialFilter);
    if (this.rarityFilter) params.set('rarity', this.rarityFilter);
    if (this.catalogMode !== 'all') params.set('mode', this.catalogMode);
    if (this.searchQuery) params.set('q', this.searchQuery);
    if (this.sortMode !== 'default') params.set('sort', this.sortMode);
    if (this.activeCat === 'favorites' && this.favorites.size > 0) params.set('fav', Array.from(this.favorites).join(','));
    const qs = params.toString();
    const newUrl = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
    history.replaceState(null, '', newUrl);
  },
  renderCatalog(this: App): void {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return; // this page has no catalog section (news/forum/about/rules/delivery/404) — nothing to render
    this.syncFiltersToUrl();
    let filtered: Product[];

    if (this.activeCat === 'all') filtered = this.products.slice();
    else if (this.activeCat === 'favorites') filtered = this.products.filter(p => this.favorites.has(p.id));
    else filtered = this.products.filter(p => p.category === this.activeCat);

    if (this.catalogMode !== 'all') {
      filtered = filtered.filter(p => p.saleType === this.catalogMode);
    }

    if (this.originFilter) {
      filtered = filtered.filter(p => p.origin === this.originFilter);
    }

    if (this.rarityFilter) {
      filtered = filtered.filter(p => p.rarity === this.rarityFilter);
    }

    if (this.materialFilter) {
      filtered = filtered.filter(p => this.materialOf(p) === this.materialFilter);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const tr = this.getProductText(p);
        return `${tr.name} ${tr.era} ${tr.desc}`.toLowerCase().includes(q);
      });
    }

    if (this.sortMode === 'price-asc') {
      filtered.sort((a, b) => (a.price ?? a.currentBid ?? Infinity) - (b.price ?? b.currentBid ?? Infinity));
    } else if (this.sortMode === 'price-desc') {
      filtered.sort((a, b) => (b.price ?? b.currentBid ?? 0) - (a.price ?? a.currentBid ?? 0));
    } else if (this.sortMode === 'new') {
      filtered.sort((a, b) => b.id - a.id);
    } else if (this.sortMode === 'ending-soon') {
      filtered.sort((a, b) => {
        const aT = a.endTime ? new Date(a.endTime).getTime() : Infinity;
        const bT = b.endTime ? new Date(b.endTime).getTime() : Infinity;
        return aT - bT;
      });
    }

    if (filtered.length === 0) {
      const emptyMsg = this.activeCat === 'favorites' ? this.t('empty_favorites') : this.nothingFoundLabel();
      grid.innerHTML = `<div class="empty-results">${emptyMsg}</div>`;
      $('lotCount').textContent = `0 ${this.t('count_in_section')}`;
      document.getElementById('heroLotCount')?.replaceChildren(document.createTextNode(String(this.products.length)));
      return;
    }

    grid.innerHTML = filtered.map(p => this.renderCard(p)).join('');

    const unit = (this.activeCat === 'all' && this.catalogMode === 'all' && !this.searchQuery) ? this.t('count_unit') : this.t('count_in_section');
    $('lotCount').textContent = `${filtered.length} ${unit}`;
    // heroLotCount only exists on the homepage (inside Hero.astro) — every other page that loads
    // app.ts (catalog, about, contacts, forum, news) doesn't have it, so this must stay optional;
    // using the throwing $() helper here used to abort init() on those pages before bindEvents()
    // ever ran, which is why no buttons worked anywhere except the homepage.
    document.getElementById('heroLotCount')?.replaceChildren(document.createTextNode(String(this.products.length)));
    this.tickTimers();
  },
  badgeLabel(this: App, badge: Badge): string {
    const map: Record<Badge, keyof typeof UI['uk']> = {
      premium: 'badge_premium', expert: 'badge_expert', museum: 'badge_museum', certified: 'badge_certified', rare: 'badge_rare'
    };
    return this.t(map[badge]);
  },
  rarityLabel(this: App, rarity: Rarity): string {
    const map: Record<Rarity, keyof typeof UI['uk']> = { common: 'rarity_common', rare: 'rarity_rare', unique: 'rarity_unique' };
    return this.t(map[rarity]);
  },
  rarityDot(this: App, p: Product): { color: string; label: string } | null {
    if (!p.rarity) return null;
    if (p.badge === 'museum') return { color: '#E0463F', label: this.t('rarity_dot_museum') };
    if (p.rarity === 'unique') return { color: '#E08A2E', label: this.t('rarity_dot_unique') };
    if (p.rarity === 'rare') return { color: '#D9B877', label: this.t('rarity_dot_rare') };
    return { color: '#4FA876', label: this.t('rarity_dot_common') };
  },
  sellerLine(this: App, seller: string): string {
    const info = SELLERS[seller];
    const verifiedMark = info?.verified
      ? `<svg viewBox="0 0 24 24" fill="currentColor" style="width:12px; color:var(--brass-light); display:inline-block; vertical-align:-1px;"><path d="M12 2l2.4 2.6 3.4-.6.8 3.4 3.1 1.6-1.4 3.2 1.4 3.2-3.1 1.6-.8 3.4-3.4-.6L12 22l-2.4-2.6-3.4.6-.8-3.4-3.1-1.6 1.4-3.2-1.4-3.2 3.1-1.6.8-3.4 3.4.6Z"/><path d="M9 12l2 2 4-4" stroke="var(--bg)" stroke-width="2" fill="none"/></svg>`
      : '';
    const ratingPart = info ? ` <span class="mono" style="color:var(--brass-light);">★ ${info.rating.toFixed(1)}</span>` : '';
    return `${seller} ${verifiedMark}${ratingPart}`;
  },
  renderCard(this: App, p: Product): string {
    const tr = this.getProductText(p);
    const isFav = this.favorites.has(p.id);
    const media = p.photo
      ? `<img class="real-photo" src="${p.photo}" alt="${tr.name}" loading="lazy" decoding="async">`
      : `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.4">${ICON_PATHS[p.icon]}</svg>`;

    let footer: string;
    if (p.saleType === 'auction') {
      const ended = !!p.endTime && new Date(p.endTime).getTime() <= Date.now();
      footer = `
        <div class="lot-price mono">${(p.currentBid ?? p.startPrice ?? 0).toLocaleString('ru-RU')} ₴</div>
        <button class="lot-add" data-action="place-bid" data-id="${p.id}" ${ended ? 'disabled' : ''}>${this.t('btn_place_bid')}</button>`;
    } else if (p.saleType === 'request') {
      footer = `
        <div class="lot-price on-request">${this.priceOnRequestLabel()}</div>
        <button class="lot-add" data-action="vip-request" data-id="${p.id}">${this.t('btn_send')}</button>`;
    } else {
      footer = `
        <div class="lot-price">${(p.price ?? 0).toLocaleString('ru-RU')} ₴</div>
        <button class="lot-add" data-action="add-to-cart" data-id="${p.id}">${this.addToCartLabel()}</button>`;
    }

    const saleBadge = p.saleType === 'request' ? '<div class="vip-badge">VIP</div>'
      : p.saleType === 'auction' ? '<div class="vip-badge" style="background:var(--brass);">АУКЦІОН</div>' : '';

    const prestigeBadge = p.badge
      ? `<span class="prestige-chip ${p.badge === 'rare' ? 'prestige-chip-rare' : ''}">${this.badgeLabel(p.badge)}</span>` : '';

    // Quick-glance specs — visible without opening the card, per the "thin card" feedback
    const specBits: string[] = [];
    if (p.conditionGrade) specBits.push(p.conditionGrade);
    if (p.dimensions) specBits.push(p.dimensions);
    if (p.origin) specBits.push(p.origin);
    const specsLine = specBits.length
      ? `<div class="lot-specs mono">${specBits.join(' · ')}</div>` : '';

    const auctionEmotion = p.saleType === 'auction'
      ? `<div class="lot-emotion mono">
           ${p.watchingNow ? `<span class="emotion-watching">🔥 ${p.watchingNow} ${this.t('label_watching_now')}</span>` : ''}
           ${p.bidsLastHour ? `<span>+${p.bidsLastHour} ${this.t('label_bids_last_hour')}</span>` : ''}
         </div>` : '';

    const buyNowChip = (p.saleType === 'auction' && p.buyNowPrice && (!p.endTime || new Date(p.endTime).getTime() > Date.now()))
      ? `<button class="buy-now-chip" data-action="buy-now" data-id="${p.id}">⚡ ${this.t('btn_buy_now')} · ${p.buyNowPrice.toLocaleString('ru-RU')} ₴</button>` : '';

    const dot = this.rarityDot(p);
    const rarityDotHtml = dot ? `<span class="rarity-dot" style="background:${dot.color};" title="${dot.label}"></span>` : '';

    const reviewsHtml = p.reviews?.length ? (() => {
      const avg = p.reviews!.reduce((sum, r) => sum + r.rating, 0) / p.reviews!.length;
      return `<span class="lot-reviews mono" title="${this.t('label_reviews')}">★ ${avg.toFixed(1)} (${p.reviews!.length})</span>`;
    })() : '';

    return `
      <div class="lot ${p.saleType === 'request' ? 'vip' : ''} ${p.saleType === 'auction' ? 'auction-lot' : ''}" data-action="open-detail" data-id="${p.id}">
        <div class="lot-media">
          <div class="lot-tag"><span class="hole"></span> LOT-0${p.id}</div>
          ${saleBadge}
          <button class="fav-btn ${isFav ? 'active' : ''}" data-action="toggle-favorite" data-id="${p.id}" aria-label="В обране">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z"/></svg>
          </button>
          <button class="compare-btn ${this.compareSet.has(p.id) ? 'active' : ''}" data-action="toggle-compare" data-id="${p.id}" aria-label="${this.t('btn_compare')}" title="${this.t('btn_compare')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h10M4 18h7"/><circle cx="19" cy="16" r="2.4"/></svg>
          </button>
          ${media}
        </div>
        <div class="lot-body">
          ${prestigeBadge}
          <div class="lot-era mono">${rarityDotHtml}${tr.era}${reviewsHtml}</div>
          <div class="lot-name">${tr.name}</div>
          <div class="lot-desc">${tr.desc}</div>
          ${specsLine}
          <div class="lot-foot">${footer}</div>
          ${buyNowChip}
          ${auctionEmotion}
          ${p.saleType === 'auction' ? `<div class="lot-watch mono">${this.t('label_bids_count')}: ${p.bidsCount ?? 0} · <span class="timer" data-timer-id="${p.id}" data-end="${p.endTime ?? ''}"></span></div>` : `
          <div class="lot-watch mono">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            ${this.watcherCount(p.id)} ${this.t('label_watchers')}
          </div>`}
          <div class="lot-watch mono" style="margin-top:3px;">
            ${this.t('label_seller')}: ${this.sellerLine(p.seller)}
            ${SELLERS[p.seller] ? `<span style="color:var(--sage);" title="${this.t('seller_positive_pct')}"> · ${Math.round((SELLERS[p.seller].rating / 5) * 100)}%</span>` : ''}
          </div>
        </div>
      </div>`;
  },
  tickTimers(this: App): void {
    if (this.timerInterval) window.clearInterval(this.timerInterval);
    const update = () => {
      const nodes = document.querySelectorAll<HTMLElement>('.timer');
      if (nodes.length === 0) return;
      nodes.forEach(node => {
        const end = node.dataset.end;
        if (!end) return;
        const ms = new Date(end).getTime() - Date.now();
        if (ms <= 0) {
          node.textContent = this.t('auction_ended');
          node.closest('.lot')?.querySelector<HTMLButtonElement>('[data-action="place-bid"]')?.setAttribute('disabled', 'true');
        } else {
          node.textContent = `${this.t('label_time_left')}: ${formatTimeLeft(ms)}`;
        }
      });
    };
    update();
    this.timerInterval = window.setInterval(update, 1000);
  },
  toggleFavorite(this: App, id: number): void {
    if (this.favorites.has(id)) this.favorites.delete(id);
    else this.favorites.add(id);
    this.renderCatalog();
  },
  /** Used by both the lot-detail seller card and the cabinet's "Мої продавці" tab. */
  toggleFollowSeller(this: App, sellerName: string): void {
    if (this.followedSellers.has(sellerName)) this.followedSellers.delete(sellerName);
    else this.followedSellers.add(sellerName);
    this.saveFollowedSellers();
    // Re-render whichever surface is currently showing this button so its state flips immediately.
    if (this.currentLotDetailId !== null) this.openLotDetail(this.currentLotDetailId);
    else if (document.getElementById('checkoutModal')?.classList.contains('active')) this.openCabinet('sellers');
  },
  saveFollowedSellers(this: App): void {
    try { localStorage.setItem('vh_followed_sellers', JSON.stringify(Array.from(this.followedSellers))); } catch { /* ignore */ }
  },
  toggleCompare(this: App, id: number): void {
    if (this.compareSet.has(id)) {
      this.compareSet.delete(id);
    } else {
      if (this.compareSet.size >= this.maxCompare) {
        this.showToast(this.t('compare_limit_msg').replace('{n}', String(this.maxCompare)));
        return;
      }
      this.compareSet.add(id);
    }
    this.renderCatalog();
    this.renderCompareBar();
    if (document.getElementById('compareModal')?.classList.contains('active')) {
      if (this.compareSet.size < 2) this.closeCompareModal();
      else this.openCompareModal();
    }
  },
  clearCompare(this: App): void {
    this.compareSet.clear();
    this.renderCatalog();
    this.renderCompareBar();
  },
  renderCompareBar(this: App): void {
    const bar = document.getElementById('compareBar');
    if (!bar) return;
    const items = this.products.filter(p => this.compareSet.has(p.id));
    bar.classList.toggle('visible', items.length >= 1);
    const thumbs = document.getElementById('compareBarThumbs');
    if (thumbs) {
      thumbs.innerHTML = items.map(p => p.photo
        ? `<img src="${p.photo}" alt="" data-action="toggle-compare" data-id="${p.id}" title="${this.t('btn_remove_listing')}" style="cursor:pointer;">`
        : '').join('');
    }
    const label = document.getElementById('compareBarLabel');
    if (label) label.textContent = `${items.length} ${this.t('compare_selected_label')}`;
    const openBtn = bar.querySelector<HTMLButtonElement>('[data-action="open-compare"]');
    if (openBtn) openBtn.disabled = items.length < 2;
  },
  openCompareModal(this: App): void {
    const items = this.products.filter(p => this.compareSet.has(p.id));
    if (items.length < 2) return;
    const rows: [string, (p: Product) => string][] = [
      [this.t('label_price'), p => `${(p.saleType === 'auction' ? (p.currentBid ?? p.startPrice ?? 0) : (p.price ?? 0)).toLocaleString('ru-RU')} ₴`],
      [this.t('field_lot_era'), p => this.getProductText(p).era],
      [this.t('label_material'), p => this.materialOf(p)],
      [this.t('label_condition'), p => p.conditionGrade ?? p.custom?.condition ?? '—'],
      [this.t('filter_origin'), p => p.origin ?? '—'],
      [this.t('filter_rarity'), p => p.rarity ? this.rarityLabel(p.rarity) : '—'],
      [this.t('label_seller'), p => p.seller],
    ];
    const card = document.getElementById('compareCard');
    if (!card) return;
    card.innerHTML = `
      <button class="modal-close-x" data-action="close-checkout-compare" aria-label="${this.t('btn_close')}">&times;</button>
      <h3 style="margin-bottom:16px;">${this.t('compare_title')}</h3>
      <div style="overflow-x:auto;">
        <table class="compare-table">
          <thead><tr><th></th>${items.map(p => `
            <th>
              ${p.photo ? `<img class="compare-col-photo" src="${p.photo}" alt="">` : ''}
              <div style="color:var(--ivory); font-weight:500; white-space:normal; max-width:160px;">${this.getProductText(p).name}</div>
              <button class="compare-remove" data-action="toggle-compare" data-id="${p.id}">${this.t('btn_remove_listing')}</button>
            </th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map(([label, fn]) => `<tr><th>${label}</th>${items.map(p => `<td>${fn(p)}</td>`).join('')}</tr>`).join('')}
            <tr><th></th>${items.map(p => `<td><button class="btn btn-primary" style="font-size:0.75rem; padding:7px 12px;" data-action="open-detail" data-id="${p.id}">${this.t('btn_view')}</button></td>`).join('')}</tr>
          </tbody>
        </table>
      </div>
      <button class="btn btn-ghost btn-block" style="margin-top:18px;" data-action="close-checkout-compare">${this.t('btn_close')}</button>
    `;
    document.getElementById('compareModal')?.classList.add('active');
  },
  closeCompareModal(this: App): void {
    document.getElementById('compareModal')?.classList.remove('active');
  },
  renderActivityStrip(this: App): void {
    const el = document.getElementById('activityStrip');
    if (!el) return;
    const activeAuctions = this.products.filter(p => p.saleType === 'auction' && p.endTime && new Date(p.endTime).getTime() > Date.now()).length;
    const newBids = this.products.reduce((sum, p) => sum + (p.bidHistory?.length ?? 0), 0);
    const newSellers = 3;

    el.innerHTML = `
      <span class="activity-strip-label">${this.t('activity_today')}:</span>
      <span class="activity-chip">${activeAuctions} ${this.t('activity_active_auctions')}</span>
      <span class="activity-chip">${newBids} ${this.t('activity_new_bids')}</span>
      <span class="activity-chip">${newSellers} ${this.t('activity_new_sellers')}</span>
    `;
  },
  /** "Последние продажи" feed (ЭТАП 1 feedback) — a richer, scrollable version of the old single
      "just sold" chip. Uses real seeded products' start/current prices; only the "N minutes ago"
      framing is presentation (computed from RECENT_SALES seed data, not live-tracked). */
  renderRecentSalesFeed(this: App): void {
    const el = document.getElementById('recentSalesFeed');
    if (!el) return;
    const rows = RECENT_SALES.map(sale => {
      const p = this.products.find(x => x.id === sale.productId);
      if (!p) return null;
      const tr = this.getProductText(p);
      const startPrice = p.startPrice ?? p.price ?? 0;
      const finalPrice = p.saleType === 'auction' ? (p.currentBid ?? startPrice) : (p.price ?? startPrice);
      const sellerInfo = SELLERS[p.seller];
      return `
        <div class="recent-sale-card" data-action="open-detail" data-id="${p.id}">
          ${p.photo ? `<img src="${p.photo}" alt="" loading="lazy">` : ''}
          <div class="recent-sale-body">
            <div class="recent-sale-name">${tr.name}</div>
            <div class="recent-sale-prices mono">
              <span class="recent-sale-start">${startPrice.toLocaleString('ru-RU')} ₴</span>
              <span class="recent-sale-arrow">→</span>
              <span class="recent-sale-final">${finalPrice.toLocaleString('ru-RU')} ₴</span>
            </div>
            <div class="recent-sale-meta">${sale.soldMinutesAgo} ${this.t('label_sold_minutes_ago')}${sellerInfo ? ` · ★ ${sellerInfo.rating.toFixed(1)}` : ''}</div>
          </div>
        </div>`;
    }).filter(Boolean).join('');

    el.innerHTML = rows ? `
      <div class="recent-sales-label">${this.t('label_just_sold_feed')}</div>
      <div class="recent-sales-scroll">${rows}</div>
    ` : '';
  },
  renderLiveAuctions(this: App): void {
    const grid = document.getElementById('liveAuctionsGrid');
    if (!grid) return;
    const auctions = this.products.filter(p => p.saleType === 'auction' && p.endTime && new Date(p.endTime).getTime() > Date.now());
    if (auctions.length === 0) { grid.innerHTML = ''; return; }

    grid.innerHTML = auctions.map(p => {
      const tr = this.getProductText(p);
      const ms = new Date(p.endTime!).getTime() - Date.now();
      const urgent = ms < 3600000;
      const media = p.photo
        ? `<img class="real-photo" src="${p.photo}" alt="${tr.name}" loading="lazy" decoding="async">`
        : `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.4">${ICON_PATHS[p.icon]}</svg>`;
      return `
        <div class="live-card" data-action="open-detail" data-id="${p.id}">
          <div class="live-card-media">${media}</div>
          <div class="live-card-body">
            <div class="live-card-name">${tr.name}</div>
            <div class="live-card-row">
              <span class="live-card-price mono">${(p.currentBid ?? p.startPrice ?? 0).toLocaleString('ru-RU')} ₴</span>
              <span class="live-card-timer ${urgent ? 'urgent' : ''} timer" data-end="${p.endTime}"></span>
            </div>
            <div class="live-card-row">
              <span>${this.t('label_bids_count')}: ${p.bidsCount ?? 0}</span>
              <button class="lot-add" data-action="place-bid" data-id="${p.id}" style="font-size:0.6875rem; padding:5px 10px;">${this.t('btn_place_bid')}</button>
            </div>
          </div>
        </div>`;
    }).join('');
    this.tickTimers();
  },

  // ---------- saved searches (alerts) ----------

  /** Counts lots matching a given category+query right now — used both to seed a saved search's
      baseline and to compute "N new since you saved this" later, instead of inventing a number. */
  matchSavedSearchCount(this: App, category: CatalogFilter, query: string): number {
    let list = this.products.slice();
    if (category === 'favorites') list = list.filter(p => this.favorites.has(p.id));
    else if (category !== 'all') list = list.filter(p => p.category === category);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p => {
        const tr = this.getProductText(p);
        return `${tr.name} ${tr.era} ${tr.desc}`.toLowerCase().includes(q);
      });
    }
    return list.length;
  },
  /** Saves the catalog's current search query + category as a revisitable, "notify me" search —
      bell button next to the search input (CatalogSection.astro). */
  saveCurrentSearch(this: App): void {
    if (!this.searchQuery && this.activeCat === 'all') {
      this.showToast(this.t('search_save_empty_msg'));
      return;
    }
    if (this.savedSearches.some(s => s.query === this.searchQuery && s.category === this.activeCat)) {
      this.showToast(this.t('search_already_saved'));
      return;
    }
    const categoryLabel = (this.activeCat === 'all' || this.activeCat === 'favorites') ? this.t('tab_all') : this.catLabel(this.activeCat as Category);
    const label = this.searchQuery
      ? (this.activeCat !== 'all' ? `«${this.searchQuery}» · ${categoryLabel}` : `«${this.searchQuery}»`)
      : categoryLabel;
    this.savedSearches.unshift({
      id: `s${Date.now()}${Math.floor(Math.random() * 1000)}`,
      label, query: this.searchQuery, category: this.activeCat,
      createdAt: new Date().toISOString(),
      matchCountAtSave: this.matchSavedSearchCount(this.activeCat, this.searchQuery),
    });
    this.saveSavedSearches();
    this.showToast(this.t('search_saved_toast'));
  },
  /** Re-applies a saved search to whichever page is open, navigating to /catalog first if the
      current page has no catalog grid to filter (mirrors goToCategory's scroll-into-view). */
  applySavedSearch(this: App, id: string): void {
    const s = this.savedSearches.find(x => x.id === id);
    if (!s) return;
    this.closeCheckout();
    if (!document.getElementById('catalogGrid')) {
      const params = new URLSearchParams();
      if (s.query) params.set('q', s.query);
      if (s.category !== 'all') params.set('category', s.category);
      window.location.href = `/catalog${params.toString() ? `?${params.toString()}` : ''}`;
      return;
    }
    this.searchQuery = s.query;
    this.activeCat = s.category;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
    if (searchInput) searchInput.value = s.query;
    document.querySelectorAll<HTMLElement>('#sidebarTabs .tab').forEach(el => el.classList.toggle('active', el.dataset.cat === s.category));
    this.renderCatalog();
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
  removeSavedSearch(this: App, id: string): void {
    this.savedSearches = this.savedSearches.filter(s => s.id !== id);
    this.saveSavedSearches();
    this.openCabinet('saved_searches');
  },
  saveSavedSearches(this: App): void {
    try { localStorage.setItem('vh_saved_searches', JSON.stringify(this.savedSearches)); } catch { /* ignore */ }
  },
};
