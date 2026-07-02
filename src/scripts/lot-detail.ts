import type { VintageHallApp as App } from './app';
import { $ } from './dom-utils';
import { ICON_PATHS, SELLERS, MATERIAL_BY_ICON, CONDITION_BY_CAT } from '../data/products';
import { EXPERTS } from '../data/experts';
import { UI } from '../data/i18n';
import type { Lang } from '../types';

declare module './app' {
  interface VintageHallApp {
  placeBid(id: number): void;
  buyNowAuction(id: number): void;
  openLotDetail(id: number): void;
  openLightbox(id: number, idx: number): void;
  renderLightbox(): void;
  lightboxStep(dir: number): void;
  closeLightbox(): void;
  initPhotoMagnifier(): void;
  initLightboxKeys(): void;
  setAutobid(id: number): void;
  enterContactLabel(): string;
  openVipRequest(id: number): void;
  submitVipRequest(id: number): void;
  showInfoModal(textKey: keyof typeof UI['uk'], titleKey: keyof typeof UI['uk']): void;
  initChat(): void;
  detectMsgLang(text: string): Lang | null;
  renderLotChat(lotId: number, seller: string): string;
  sendLotChat(lotId: number, seller: string): void;
  }
}

export const lotDetailMethods = {
  placeBid(this: App, id: number): void {
    if (!this.currentUser) {
      alert(this.t('bid_login_required'));
      this.openLogin('my_lots');
      return;
    }
    const p = this.products.find(x => x.id === id);
    if (!p || p.saleType !== 'auction') return;
    if (p.endTime && new Date(p.endTime).getTime() <= Date.now()) return;

    const step = p.bidStep ?? 100;
    const newBid = (p.currentBid ?? p.startPrice ?? 0) + step;
    p.currentBid = newBid;
    p.bidsCount = (p.bidsCount ?? 0) + 1;
    p.bidHistory = [{ user: this.currentUser, bid: newBid, time: new Date().toISOString() }, ...(p.bidHistory ?? [])];
    this.pushBidRemote(id, newBid);

    // Anti-sniping: a bid placed inside the last 5 minutes pushes the close time out by 5 more
    // minutes, so a last-second bid can't win outright — mirrors how real auction houses (and
    // Violity) prevent snipe-bidding from deciding an item nobody else had a chance to counter.
    const ANTI_SNIPE_WINDOW_MS = 5 * 60 * 1000;
    let extended = false;
    if (p.endTime) {
      const remaining = new Date(p.endTime).getTime() - Date.now();
      if (remaining > 0 && remaining < ANTI_SNIPE_WINDOW_MS) {
        p.endTime = new Date(Date.now() + ANTI_SNIPE_WINDOW_MS).toISOString();
        extended = true;
      }
    }

    this.showToast(extended
      ? `${this.t('bid_placed_as')} <span class="mono">${newBid.toLocaleString('uk-UA')} ₴</span><br><span style="font-size:0.75rem; color:var(--brass-light);">${this.t('auction_extended_msg')}</span>`
      : `${this.t('bid_placed_as')} <span class="mono">${newBid.toLocaleString('uk-UA')} ₴</span>`);
    this.renderCatalog();
    if ($('checkoutModal').classList.contains('active')) this.openLotDetail(id);
  },
  /** "Купити зараз" — instant-purchase price on an auction listing. Closes the auction immediately
      in the buyer's favour by recording a winning bid and backdating endTime, which makes it surface
      correctly in "Виграні лоти" (renderWonLots) without any separate purchase-tracking code. */
  buyNowAuction(this: App, id: number): void {
    if (!this.currentUser) {
      alert(this.t('bid_login_required'));
      this.openLogin('my_bids');
      return;
    }
    const p = this.products.find(x => x.id === id);
    if (!p || p.saleType !== 'auction' || !p.buyNowPrice) return;
    if (p.endTime && new Date(p.endTime).getTime() <= Date.now()) return;

    const price = p.buyNowPrice;
    p.currentBid = price;
    p.bidsCount = (p.bidsCount ?? 0) + 1;
    p.bidHistory = [{ user: this.currentUser, bid: price, time: new Date().toISOString() }, ...(p.bidHistory ?? [])];
    p.endTime = new Date(Date.now() - 1000).toISOString();
    this.pushBidRemote(id, price);

    this.showToast(`${this.t('buy_now_success')} <span class="mono">${price.toLocaleString('uk-UA')} ₴</span>`);
    this.renderCatalog();
    if ($('checkoutModal').classList.contains('active')) this.openLotDetail(id);
  },
  openLotDetail(this: App, id: number): void {
    const p = this.products.find(x => x.id === id);
    if (!p) return;
    this.currentLotDetailId = id;
    const tr = this.getProductText(p);
    const material = p.custom?.material || MATERIAL_BY_ICON[p.icon][this.currentLang];
    const condition = p.custom?.condition || CONDITION_BY_CAT[p.category][this.currentLang];
    const sellerInfo = SELLERS[p.seller];

    let priceBlock: string;
    let actionBtn: string;
    let extraRows = '';
    let historyBlock = '';
    let autobidBlock = '';

    if (p.saleType === 'auction') {
      const ended = !!p.endTime && new Date(p.endTime).getTime() <= Date.now();
      const minNext = (p.currentBid ?? p.startPrice ?? 0) + (p.bidStep ?? 100);
      priceBlock = `<div class="lot-price mono" style="font-size:1.25rem;">${(p.currentBid ?? p.startPrice ?? 0).toLocaleString('uk-UA')} ₴</div>`;
      actionBtn = `<button class="btn btn-primary" style="width:100%; justify-content:center; margin-top:14px;" data-action="place-bid" data-id="${id}" ${ended ? 'disabled' : ''}>${this.t('btn_place_bid')}</button>`;
      if (!ended && p.buyNowPrice) {
        actionBtn += `<button class="btn btn-ghost" style="width:100%; justify-content:center; margin-top:8px;" data-action="buy-now" data-id="${id}">⚡ ${this.t('btn_buy_now')} · <span class="mono">${p.buyNowPrice.toLocaleString('uk-UA')} ₴</span></button>`;
      }
      extraRows = `
        <tr><td>${this.t('label_start_price')}</td><td>${(p.startPrice ?? 0).toLocaleString('uk-UA')} ₴</td></tr>
        <tr><td>${this.t('label_min_next_bid')}</td><td class="mono">${minNext.toLocaleString('uk-UA')} ₴</td></tr>
        <tr><td>${this.t('label_bids_count')}</td><td>${p.bidsCount ?? 0}</td></tr>
        <tr><td>${this.t('label_time_left')}</td><td><span class="timer" data-timer-id="${id}" data-end="${p.endTime ?? ''}"></span></td></tr>`;
      const hist = p.bidHistory ?? [];
      historyBlock = `
        <div style="font-size:0.8125rem; color:var(--sage); margin:14px 0 6px;">${this.t('label_bid_history')}
          ${p.watchingNow ? `<span style="color:var(--oxblood);"> · 🔥 ${p.watchingNow} ${this.t('label_watching_now')}</span>` : ''}
        </div>
        ${hist.length === 0 ? `<p style="font-size:0.8125rem; color:var(--sage);">${this.t('no_bids_yet')}</p>` : hist.slice(0, 6).map(h => `
          <div style="display:flex; justify-content:space-between; font-size:0.78125rem; color:var(--sage); padding:4px 0; border-bottom:1px solid var(--line);">
            <span>${h.user}</span><span class="mono">${h.bid.toLocaleString('uk-UA')} ₴</span>
          </div>`).join('')}`;
      if (!ended) {
        autobidBlock = `
          <div class="autobid-row">
            <input type="number" id="autobidMax-${id}" placeholder="${this.t('field_autobid_max')}" min="${minNext}">
            <button class="btn btn-ghost" style="font-size:0.78125rem; padding:9px 14px;" data-action="set-autobid" data-id="${id}">${this.t('btn_autobid')}</button>
          </div>`;
      }
    } else if (p.saleType === 'request') {
      priceBlock = `<div class="lot-price on-request">${this.priceOnRequestLabel()}</div>`;
      actionBtn = `<button class="btn btn-primary" style="width:100%; justify-content:center; margin-top:14px;" data-action="open-vip-from-detail" data-id="${id}">${this.t('btn_send')}</button>`;
    } else {
      priceBlock = `<div class="lot-price mono" style="font-size:1.25rem;">${(p.price ?? 0).toLocaleString('uk-UA')} ₴</div>`;
      actionBtn = `<button class="btn btn-primary" style="width:100%; justify-content:center; margin-top:14px;" data-action="add-to-cart-and-close" data-id="${id}">${this.addToCartLabel()}</button>`;
    }

    const richRows = `
      ${p.dimensions ? `<tr><td>${this.t('label_dimensions')}</td><td>${p.dimensions}</td></tr>` : ''}
      ${p.weight ? `<tr><td>${this.t('label_weight')}</td><td>${p.weight}</td></tr>` : ''}
      ${p.conditionGrade ? `<tr><td>${this.t('label_grade')}</td><td>${p.conditionGrade}</td></tr>` : ''}
      ${p.origin ? `<tr><td>${this.t('label_origin')}</td><td>${p.origin}</td></tr>` : ''}
      ${p.rarity ? `<tr><td>${this.t('label_rarity')}</td><td>${this.rarityLabel(p.rarity)}</td></tr>` : ''}
      ${p.certified ? `<tr><td>${this.t('label_certified_short')}</td><td>✓</td></tr>` : ''}`;

    const provenanceBlock = p.provenance
      ? `<div style="background:var(--accent-tint); border-radius:var(--radius); padding:12px 14px; margin:14px 0; font-size:0.8125rem; color:var(--ivory); line-height:1.55;">
          <div style="font-size:0.6875rem; color:var(--sage); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:5px;">${this.t('label_provenance')}</div>
          ${p.provenance[this.currentLang]}
        </div>` : '';

    const videoBlock = p.videoUrl
      ? `<a href="${p.videoUrl}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; gap:8px; font-size:0.84375rem; color:var(--brass-light); margin:10px 0 4px; text-decoration:underline;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="14" height="14" rx="2"/><path d="m22 8-6 4 6 4Z"/></svg>
          ${this.t('label_video_walkthrough')}
        </a>` : '';

    const investmentBlock = p.investmentRating ? `
      <div class="investment-card">
        <div class="investment-row">
          <span>${this.t('label_investment')}</span>
          <span class="mono" style="color:var(--brass-light);">${'★'.repeat(p.investmentRating)}${'☆'.repeat(5 - p.investmentRating)}</span>
        </div>
        ${p.priceGrowthPct ? `<div class="investment-row">
          <span>${this.t('label_price_growth')} <span style="color:var(--sage);">${this.t('label_price_growth_years').replace('{n}', String(p.priceGrowthYears ?? 5))}</span></span>
          <span class="mono" style="color:#4FA876;">+${p.priceGrowthPct}%</span>
        </div>` : ''}
      </div>` : '';

    const priceHistoryBlock = p.priceHistory?.length ? `
      <div style="margin:14px 0 6px; font-size:0.8125rem; color:var(--sage);">${this.t('label_price_history')}</div>
      <div class="price-history-list">
        ${p.priceHistory.map(h => `<div class="price-history-row"><span class="mono">${h.year}</span><span class="mono" style="color:var(--brass-light);">${h.price.toLocaleString('uk-UA')} ₴</span></div>`).join('')}
      </div>` : '';

    const isFollowing = this.followedSellers.has(p.seller);
    const sellerBlock = sellerInfo ? `
      <div class="seller-card">
        <a href="/seller/${encodeURIComponent(p.seller)}" class="seller-card-avatar" style="text-decoration:none;">${p.seller.slice(0, 2).toUpperCase()}</a>
        <div style="flex:1;">
          <a href="/seller/${encodeURIComponent(p.seller)}" class="seller-card-name" style="text-decoration:none;">${this.sellerLine(p.seller)}</a>
          <div class="seller-card-meta">${sellerInfo.salesCount} ${this.t('seller_sales')} · ${this.t('seller_member_since')} ${2026 - sellerInfo.yearsActive} · ${Math.round((sellerInfo.rating / 5) * 100)}% ${this.t('seller_positive_pct')}</div>
        </div>
        <button class="btn ${isFollowing ? 'btn-primary' : 'btn-ghost'}" style="font-size:0.6875rem; padding:7px 10px; flex-shrink:0;" data-action="toggle-follow-seller" data-seller="${p.seller}">${isFollowing ? this.t('btn_unfollow_seller') : this.t('btn_follow_seller')}</button>
      </div>` : '';

    const galleryPhotos = [p.photo, ...(p.extraPhotos ?? [])].filter((src): src is string => !!src);
    const galleryBlock = galleryPhotos.length ? `
      <div class="detail-gallery">
        <div class="detail-gallery-main" data-action="open-lightbox" data-id="${id}" data-idx="0">
          <img class="real-photo" src="${galleryPhotos[0]}" alt="${tr.name}">
          <div class="detail-gallery-zoom-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>
          </div>
        </div>
        ${galleryPhotos.length > 1 ? `<div class="detail-gallery-thumbs">
          ${galleryPhotos.map((src, i) => `<button class="detail-thumb ${i === 0 ? 'active' : ''}" data-action="open-lightbox" data-id="${id}" data-idx="${i}" aria-label="${this.t('label_photo')} ${i + 1}"><img src="${src}" alt=""></button>`).join('')}
        </div>` : ''}
      </div>` : '';

    const reviewsBlock = p.reviews?.length ? (() => {
      const avg = p.reviews!.reduce((s, r) => s + r.rating, 0) / p.reviews!.length;
      return `
        <div style="margin:18px 0 8px; display:flex; align-items:baseline; gap:8px;">
          <span style="font-size:0.875rem; color:var(--ivory); font-weight:500;">${this.t('label_reviews')}</span>
          <span class="mono" style="color:var(--brass-light);">★ ${avg.toFixed(1)} (${p.reviews!.length})</span>
        </div>
        <div class="reviews-list">
          ${p.reviews!.map(r => `
            <div class="review-row">
              <div class="review-row-head"><span>${r.author}</span><span class="mono" style="color:var(--brass-light);">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span></div>
              <div class="review-row-date mono">${r.date}</div>
              <p>${r.text}</p>
            </div>`).join('')}
        </div>`;
    })() : `<p style="font-size:0.78125rem; color:var(--sage); margin-top:16px;">${this.t('reviews_empty')}</p>`;

    // Expert verification block (#"Система экспертов" feedback) — credentials, not just a generic badge.
    const expert = p.expertId ? EXPERTS[p.expertId] : undefined;
    const expertBlock = expert ? `
      <div class="seller-card" style="background:var(--accent-tint-strong); border:1px solid var(--line);">
        <div class="seller-card-avatar" style="background:var(--oxblood);">${expert.name.split(' ').map(w => w[0]).join('')}</div>
        <div style="flex:1;">
          <div class="seller-card-name">✓ ${this.t('label_expert_verification')} — ${expert.name}</div>
          <div class="seller-card-meta">${expert.specialization} · ${expert.yearsExperience} ${this.t('label_years_experience')} · ${expert.verificationsCount} ${this.t('label_verifications')} · ★ ${expert.rating.toFixed(1)}</div>
        </div>
      </div>` : '';

    // Public Q&A thread (#"встроить форум в карточку" feedback) — distinct from the private buyer-seller chat below.
    const qaBlock = p.qa?.length ? `
      <div style="margin:18px 0 8px; font-size:0.875rem; color:var(--ivory); font-weight:500;">${this.t('label_qa')}</div>
      <div class="reviews-list">
        ${p.qa.map(item => `
          <div class="review-row">
            <div class="review-row-head"><span>${item.author}</span></div>
            <p style="font-style:italic;">${item.question}</p>
            <div class="review-row-head" style="margin-top:8px;"><span style="color:${item.answerIsExpert ? 'var(--oxblood)' : 'var(--brass-light)'};">${item.answerIsExpert ? '✓ ' : ''}${item.answerAuthor}</span></div>
            <p>${item.answer}</p>
          </div>`).join('')}
      </div>` : '';

    // Similar lots (#"Рекомендуемые предметы" feedback) — same category, excluding the current lot.
    const similar = this.products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 3);
    const similarLotsBlock = similar.length ? `
      <div style="margin:18px 0 10px; font-size:0.875rem; color:var(--ivory); font-weight:500;">${this.t('label_similar_lots')}</div>
      <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:4px;">
        ${similar.map(s => {
          const str = this.getProductText(s);
          const sPrice = s.saleType === 'auction' ? (s.currentBid ?? s.startPrice ?? 0) : (s.price ?? 0);
          return `
            <div style="flex-shrink:0; width:120px; cursor:pointer;" data-action="open-detail" data-id="${s.id}">
              <div style="aspect-ratio:1; border-radius:var(--radius); overflow:hidden; background:var(--accent-tint); margin-bottom:6px;">
                ${s.photo ? `<img src="${s.photo}" alt="" style="width:100%; height:100%; object-fit:cover;">` : ''}
              </div>
              <div style="font-size:0.71875rem; color:var(--ivory); line-height:1.3; margin-bottom:2px;">${str.name}</div>
              <div class="mono" style="font-size:0.71875rem; color:var(--brass-light);">${sPrice.toLocaleString('uk-UA')} ₴</div>
            </div>`;
        }).join('')}
      </div>` : '';

    $('checkoutCard').classList.add('wide');
    $('checkoutCard').innerHTML = `
      <button class="modal-close-x" data-action="close-checkout" aria-label="Закрити">&times;</button>
      ${galleryBlock}
      ${p.badge ? `<span class="prestige-chip ${p.badge === 'rare' ? 'prestige-chip-rare' : ''}">${this.badgeLabel(p.badge)}</span>` : ''}
      <h3>${tr.name}</h3>
      <div class="sub">${this.rarityDot(p) ? `<span class="rarity-dot" style="background:${this.rarityDot(p)!.color};" title="${this.rarityDot(p)!.label}"></span>` : ''}LOT-0${id} · ${tr.era}${this.rarityDot(p) ? ` · ${this.rarityDot(p)!.label}` : ''}</div>
      ${sellerBlock}
      ${p.saleType !== 'auction' ? `<div class="detail-watch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        ${this.watcherCount(id)} ${this.t('label_watchers')}
      </div>` : ''}
      <table class="specs-table">
        <tr><td>${this.t('label_category')}</td><td>${this.catLabel(p.category)}</td></tr>
        <tr><td>${this.t('label_material')}</td><td>${material}</td></tr>
        <tr><td>${this.t('label_condition')}</td><td>${condition}</td></tr>
        ${richRows}
        ${extraRows}
        <tr><td>${this.t('label_delivery')}</td><td>${this.t('delivery_note')}</td></tr>
      </table>
      ${provenanceBlock}
      ${videoBlock}
      ${expertBlock}
      ${investmentBlock}
      ${priceHistoryBlock}
      ${historyBlock}
      ${autobidBlock}
      <p style="font-size:0.875rem; color:var(--sage); line-height:1.55; margin:10px 0 6px;">${tr.desc}</p>
      ${priceBlock}
      ${actionBtn}
      ${reviewsBlock}
      ${qaBlock}
      ${similarLotsBlock}
      ${this.renderLotChat(id, p.seller)}
      <button class="btn btn-ghost btn-block mt-md" data-action="close-checkout">${this.t('btn_close')}</button>
    `;
    $('checkoutModal').classList.add('active');
    if (p.saleType === 'auction') this.tickTimers();
  },
  openLightbox(this: App, id: number, idx: number): void {
    const p = this.products.find(x => x.id === id);
    if (!p) return;
    const photos = [p.photo, ...(p.extraPhotos ?? [])].filter((src): src is string => !!src);
    if (photos.length === 0) return;
    this.lightboxPhotos = photos;
    this.lightboxIndex = Math.max(0, Math.min(idx, photos.length - 1));
    this.lightboxThumbsId = id;
    this.renderLightbox();
    $('photoLightbox').classList.add('active');
    document.body.classList.add('lightbox-open');
  },
  renderLightbox(this: App): void {
    const img = $<HTMLImageElement>('lightboxImg');
    img.style.transform = 'scale(1)'; // reset any leftover magnifier zoom from the previous photo
    img.removeAttribute('style');
    img.src = this.lightboxPhotos[this.lightboxIndex];

    const multi = this.lightboxPhotos.length > 1;
    $('lightboxPrev').style.display = multi ? 'flex' : 'none';
    $('lightboxNext').style.display = multi ? 'flex' : 'none';
    const counter = $('lightboxCounter');
    counter.style.display = multi ? 'block' : 'none';
    counter.textContent = multi ? `${this.lightboxIndex + 1} / ${this.lightboxPhotos.length}` : '';

    // Keep the thumbnail strip in the lot detail modal in sync with the lightbox position
    if (this.lightboxThumbsId !== null) {
      document.querySelectorAll<HTMLElement>(`.detail-thumb[data-id="${this.lightboxThumbsId}"]`).forEach((el, i) => {
        el.classList.toggle('active', i === this.lightboxIndex);
      });
    }
  },
  lightboxStep(this: App, dir: number): void {
    if (this.lightboxPhotos.length < 2) return;
    this.lightboxIndex = (this.lightboxIndex + dir + this.lightboxPhotos.length) % this.lightboxPhotos.length;
    this.renderLightbox();
  },
  closeLightbox(this: App): void {
    $('photoLightbox').classList.remove('active');
    document.body.classList.remove('lightbox-open');
  },
  /** Hover-to-magnify on lot photos: scales the image around the cursor position, clipped by its container. */
  initPhotoMagnifier(this: App): void {
    document.body.addEventListener('mousemove', (e) => {
      const target = e.target as HTMLElement;
      if (!target.classList?.contains('magnify-img') && !target.classList?.contains('real-photo')) return;
      const rect = target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      target.style.transformOrigin = `${x}% ${y}%`;
      target.style.transform = 'scale(2.2)';
    });
    document.body.addEventListener('mouseout', (e) => {
      const target = e.target as HTMLElement;
      if (!target.classList?.contains('magnify-img') && !target.classList?.contains('real-photo')) return;
      target.style.transform = 'scale(1)';
      target.style.transformOrigin = '';
    });
  },
  initLightboxKeys(this: App): void {
    document.addEventListener('keydown', (e) => {
      if (!$('photoLightbox').classList.contains('active')) return;
      if (e.key === 'Escape') this.closeLightbox();
      else if (e.key === 'ArrowLeft') this.lightboxStep(-1);
      else if (e.key === 'ArrowRight') this.lightboxStep(1);
    });
  },
  setAutobid(this: App, id: number): void {
    const input = document.getElementById(`autobidMax-${id}`) as HTMLInputElement | null;
    if (!input) return;
    const max = parseInt(input.value, 10);
    if (!this.currentUser) { alert(this.t('bid_login_required')); this.openLogin('my_bids'); return; }
    if (isNaN(max) || max <= 0) return;
    this.showToast(`${this.t('autobid_set')}: <span class="mono">${max.toLocaleString('uk-UA')} ₴</span>`);
    // Demo-scope: confirms the intent without a live backend to execute future automatic bids.
  },
  enterContactLabel(this: App): string {
    const map: Record<Lang, string> = {
      en: 'Please provide a phone or Telegram contact.', pl: 'Podaj telefon lub Telegram.',
      ru: 'Укажите телефон или Telegram для связи.', uk: "Вкажіть телефон або Telegram для зв'язку."
    };
    return map[this.currentLang];
  },
  openVipRequest(this: App, id: number): void {
    const p = this.products.find(x => x.id === id);
    if (!p) return;
    const tr = this.getProductText(p);
    $('checkoutCard').innerHTML = `
      <h3>${this.t('vip_title')}</h3>
      <div class="sub">${tr.name} · ${tr.era}</div>
      <div class="field"><label>${this.t('field_name')}</label><input id="vipName"></div>
      <div class="field"><label>${this.t('field_contact')}</label><input id="vipContact"></div>
      <div class="pay-note">${this.t('vip_note')}</div>
      <div class="modal-actions">
        <button class="btn btn-ghost" data-action="close-checkout">${this.t('btn_cancel')}</button>
        <button class="btn btn-primary" data-action="submit-vip-request" data-id="${id}">${this.t('btn_send')}</button>
      </div>
    `;
    $('checkoutModal').classList.add('active');
  },
  submitVipRequest(this: App, id: number): void {
    const contact = $<HTMLInputElement>('vipContact').value.trim();
    if (!contact) { alert(this.enterContactLabel()); return; }
    const p = this.products.find(x => x.id === id);
    if (!p) return;
    const tr = this.getProductText(p);
    $('checkoutCard').innerHTML = `
      <div class="confirm-screen">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>
        <h3>${this.t('vip_confirm_title')}</h3>
        <p class="sub">${this.t('vip_confirm_sub')}${tr.name}»</p>
        <button class="btn btn-primary" style="margin-top:10px; width:100%; justify-content:center;" data-action="close-checkout">${this.t('btn_done')}</button>
      </div>
    `;
  },
  showInfoModal(this: App, textKey: keyof typeof UI['uk'], titleKey: keyof typeof UI['uk']): void {
    $('checkoutCard').innerHTML = `
      <h3>${this.t(titleKey)}</h3>
      <p style="font-size:0.875rem; color:var(--sage); line-height:1.6; margin-top:14px;">${this.t(textKey)}</p>
      <button class="btn btn-ghost" style="width:100%; justify-content:center; margin-top:18px;" data-action="close-checkout">${this.t('btn_close')}</button>
    `;
    $('checkoutModal').classList.add('active');
  },
  /** Detects which of the site's 4 languages a typed message is written in, so the support bot
      can reply in the visitor's own words rather than whatever language the UI happens to be set
      to. Plain Cyrillic without a letter unique to either alphabet (uk: і ї є ґ, ru: ъ ы э) is
      genuinely ambiguous between uk/ru — returns null so the caller falls back to the site's
      current language instead of guessing. */
  detectMsgLang(this: App, text: string): Lang | null {
    if (/[ąęłżźćśńĄĘŁŻŹĆŚŃ]/.test(text)) return 'pl';
    if (/[іїєґІЇЄҐ]/.test(text)) return 'uk';
    if (/[ъыэЪЫЭ]/.test(text)) return 'ru';
    if (/[а-яёА-ЯЁ]/.test(text)) return null;
    if (/[a-zA-Z]/.test(text)) return 'en';
    return null;
  },
  initChat(this: App): void {
    const fab = document.getElementById('chatFab');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatCloseBtn');
    const sendBtn = document.getElementById('chatSendBtn');
    const input = document.getElementById('chatInput') as HTMLInputElement | null;
    const body = document.getElementById('chatBody');
    if (!fab || !panel || !closeBtn || !sendBtn || !input || !body) return;

    fab.addEventListener('click', () => panel.classList.toggle('active'));
    closeBtn.addEventListener('click', () => panel.classList.remove('active'));

    const send = () => {
      const text = input.value.trim();
      if (!text) return;
      body.innerHTML += `<div class="chat-msg user">${text}</div>`;
      input.value = '';
      body.scrollTop = body.scrollHeight;
      const replyLang = this.detectMsgLang(text) ?? this.currentLang;
      setTimeout(() => {
        body.innerHTML += `<div class="chat-msg bot">${UI[replyLang].chat_auto_reply}</div>`;
        body.scrollTop = body.scrollHeight;
      }, 1200);
    };

    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  },
  renderLotChat(this: App, lotId: number, seller: string): string {
    const msgs = this.lotChatMessages[lotId] ?? [];
    const msgHtml = msgs.length === 0
      ? ''
      : msgs.map(m => `<div class="chat-msg ${m.user === seller ? 'bot' : 'user'}">${m.text}</div>`).join('');

    const labels: Record<Lang, {title: string; ph: string; send: string; login: string}> = {
      uk: { title: 'Чат з продавцем', ph: 'Ваше питання продавцю...', send: '→', login: 'Увійдіть, щоб написати продавцю' },
      en: { title: 'Chat with seller', ph: 'Your question to the seller...', send: '→', login: 'Sign in to message the seller' },
      pl: { title: 'Czat ze sprzedawcą', ph: 'Twoje pytanie do sprzedawcy...', send: '→', login: 'Zaloguj się, aby napisać do sprzedawcy' },
      ru: { title: 'Чат с продавцом', ph: 'Ваш вопрос продавцу...', send: '→', login: 'Войдите, чтобы написать продавцу' }
    };
    const l = labels[this.currentLang];

    const inputRow = this.currentUser
      ? `<div class="lot-chat-row"><input type="text" id="lotChatInput" placeholder="${l.ph}"><button data-action="send-lot-chat" data-id="${lotId}" data-seller="${seller}">${l.send}</button></div>`
      : `<div style="font-size:0.75rem; color:var(--sage); margin-top:8px;">${l.login}</div>`;

    return `
      <div class="lot-chat">
        <div class="lot-chat-title">${l.title}</div>
        <div class="lot-chat-messages">${msgHtml}</div>
        ${inputRow}
      </div>`;
  },
  sendLotChat(this: App, lotId: number, seller: string): void {
    const input = document.getElementById('lotChatInput') as HTMLInputElement | null;
    if (!input) return;
    const text = input.value.trim();
    if (!text || !this.currentUser) return;

    if (!this.lotChatMessages[lotId]) this.lotChatMessages[lotId] = [];
    this.lotChatMessages[lotId].push({ user: this.currentUser, text });

    // Simulate seller auto-reply
    setTimeout(() => {
      const replies: Record<Lang, string[]> = {
        uk: ['Дякую за запитання! Зараз перевірю і відповім.', 'Так, стан відповідає фото. Можу надіслати додаткові знімки.'],
        en: ['Thanks for asking! Let me check and get back to you.', 'Yes, the condition matches the photos. I can send additional shots.'],
        pl: ['Dziękuję za pytanie! Sprawdzę i odpowiem.', 'Tak, stan odpowiada zdjęciom. Mogę wysłać dodatkowe zdjęcia.'],
        ru: ['Спасибо за вопрос! Сейчас проверю и отвечу.', 'Да, состояние соответствует фото. Могу прислать дополнительные снимки.']
      };
      const pool = replies[this.currentLang];
      this.lotChatMessages[lotId].push({ user: seller, text: pool[Math.floor(Math.random() * pool.length)] });
      // Re-render detail if still open
      if (document.getElementById('checkoutModal')?.classList.contains('active')) {
        this.openLotDetail(lotId);
      }
    }, 2000);

    // Re-render immediately to show user's message
    this.openLotDetail(lotId);
  },
};
