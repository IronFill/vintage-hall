import type { VintageHallApp as App } from './app';
import { $ } from './dom-utils';
import { ICON_LABELS, SELLERS } from '../data/products';
import { UI } from '../data/i18n';
import type { IconKey, Category, DashboardRole, SaleType, Product, Lang } from '../types';

declare module './app' {
  interface VintageHallApp {
  enterNameLabel(): string;
  openLogin(afterTab: string): void;
  submitLogin(afterTab: string): void;
  logout(): void;
  openCabinet(tab: string): void;
  itemNameRequiredLabel(): string;
  priceRequiredLabel(): string;
  renderRoleToggle(): string;
  renderWallet(): string;
  renderMyBids(): string;
  renderWonLots(): string;
  renderFavoritesTab(): string;
  renderSellersTab(): string;
  renderMyCollection(): string;
  renderCabinetModal(tab: string): void;
  setRole(role: DashboardRole): void;
  commissionBoxHtml(price: number): string;
  updateCommissionBox(): void;
  editListing(id: number): void;
  cancelEditListing(): void;
  removeListing(id: number): void;
  handleSaleTypeChange(): void;
  publishListing(): void;
  }
}

export const cabinetMethods = {
  enterNameLabel(this: App): string {
    const map: Record<Lang, string> = { en: 'Please enter your name.', pl: 'Podaj swoje imię.', ru: 'Укажите ваше имя.', uk: "Вкажіть ваше ім'я." };
    return map[this.currentLang];
  },
  openLogin(this: App, afterTab: string): void {
    $('checkoutCard').innerHTML = `
      <h3>${this.t('login_title')}</h3>
      <div class="field"><label>${this.t('field_login_name')}</label><input id="loginName"></div>
      <div class="modal-actions">
        <button class="btn btn-ghost" data-action="close-checkout">${this.t('btn_cancel')}</button>
        <button class="btn btn-primary" data-action="submit-login" data-tab="${afterTab}">${this.t('btn_login')}</button>
      </div>
    `;
    $('checkoutModal').classList.add('active');
  },
  submitLogin(this: App, afterTab: string): void {
    const name = $<HTMLInputElement>('loginName').value.trim();
    if (!name) { alert(this.enterNameLabel()); return; }
    this.currentUser = name;
    this.savePreference('vh_user', name);
    this.openCabinet(afterTab);
  },
  logout(this: App): void {
    this.currentUser = null;
    this.clearSavedUser();
    this.closeCheckout();
  },
  openCabinet(this: App, tab: string): void {
    this.currentLotDetailId = null;
    this.renderCabinetModal(tab);
    $('checkoutModal').classList.add('active');
  },
  itemNameRequiredLabel(this: App): string {
    const map: Record<Lang, string> = { en: 'Please enter the item name.', pl: 'Podaj nazwę przedmiotu.', ru: 'Укажите название вещи.', uk: 'Вкажіть назву речі.' };
    return map[this.currentLang];
  },
  priceRequiredLabel(this: App): string {
    const map: Record<Lang, string> = {
      en: 'Please enter a starting price.', pl: 'Podaj cenę.',
      ru: 'Укажите цену.', uk: 'Вкажіть ціну.'
    };
    return map[this.currentLang];
  },
  renderRoleToggle(this: App): string {
    return `
      <div class="tabs" style="margin-bottom:12px;">
        <button class="tab ${this.dashboardRole === 'buyer' ? 'active' : ''}" data-action="set-role" data-role="buyer">${this.t('role_buyer')}</button>
        <button class="tab ${this.dashboardRole === 'seller' ? 'active' : ''}" data-action="set-role" data-role="seller">${this.t('role_seller')}</button>
      </div>`;
  },
  renderWallet(this: App): string {
    return `
      <div style="background:var(--accent-tint); border-radius:var(--radius); padding:16px; margin-bottom:14px;">
        <div style="font-size:0.75rem; color:var(--sage); text-transform:uppercase; letter-spacing:0.05em;">${this.t('wallet_balance')}</div>
        <div class="mono" style="font-size:1.5rem; color:var(--brass-light); margin-top:4px;">${this.walletBalance.toLocaleString('ru-RU')} ₴</div>
      </div>
      <p style="font-size:0.78125rem; color:var(--sage); margin-bottom:16px;">${this.t('wallet_note')}</p>
      <div style="font-size:0.8125rem; color:var(--sage); margin-bottom:8px;">${this.t('wallet_commission_history')}</div>
      <p style="font-size:0.8125rem; color:var(--sage);">${this.t('wallet_no_history')}</p>`;
  },
  renderMyBids(this: App): string {
    const mine = this.products.filter(p => p.saleType === 'auction' && p.bidHistory?.some(h => h.user === this.currentUser));
    if (mine.length === 0) return `<p style="font-size:0.8125rem; color:var(--sage); padding:20px 0;">${this.t('empty_my_bids')}</p>`;
    return mine.map(p => {
      const tr = this.getProductText(p);
      const leading = p.bidHistory?.[0]?.user === this.currentUser;
      const statusColor = leading ? '#1D9E75' : 'var(--oxblood)';
      const statusText = leading ? this.t('status_leading') : this.t('status_outbid');
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--line); font-size:0.8125rem;">
          <span>${tr.name} <span class="mono" style="color:var(--sage);">· LOT-0${p.id}</span></span>
          <span class="mono" style="color:${statusColor};">${statusText} · ${(p.currentBid ?? 0).toLocaleString('ru-RU')} ₴</span>
        </div>`;
    }).join('');
  },
  renderWonLots(this: App): string {
    const won = this.products.filter(p =>
      p.saleType === 'auction' && p.endTime && new Date(p.endTime).getTime() <= Date.now() && p.bidHistory?.[0]?.user === this.currentUser
    );
    if (won.length === 0) return `<p style="font-size:0.8125rem; color:var(--sage); padding:20px 0;">${this.t('empty_won_lots')}</p>`;
    return won.map(p => {
      const tr = this.getProductText(p);
      return `<div style="padding:10px 0; border-bottom:1px solid var(--line); font-size:0.8125rem;">${tr.name} — ${(p.currentBid ?? 0).toLocaleString('ru-RU')} ₴</div>`;
    }).join('');
  },
  /** "Обране" cabinet tab (#14) — same favorites set used by the catalog's ♥ filter, surfaced inside the cabinet too. */
  renderFavoritesTab(this: App): string {
    const favs = this.products.filter(p => this.favorites.has(p.id));
    if (favs.length === 0) return `<p style="font-size:0.8125rem; color:var(--sage); padding:20px 0;">${this.t('empty_favorites')}</p>`;
    return favs.map(p => {
      const tr = this.getProductText(p);
      const priceLabel = p.saleType === 'auction' ? (p.currentBid ?? p.startPrice ?? 0) : (p.price ?? 0);
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--line); font-size:0.8125rem; cursor:pointer;" data-action="open-detail" data-id="${p.id}">
          <span>${tr.name} <span class="mono" style="color:var(--sage);">· LOT-0${p.id}</span></span>
          <span class="mono" style="color:var(--brass-light);">${priceLabel.toLocaleString('ru-RU')} ₴</span>
        </div>`;
    }).join('');
  },
  renderSellersTab(this: App): string {
    const names = Object.keys(SELLERS).sort((a, b) => Number(this.followedSellers.has(b)) - Number(this.followedSellers.has(a)));
    if (names.length === 0) return `<p style="font-size:0.8125rem; color:var(--sage); padding:20px 0;">${this.t('empty_my_sellers')}</p>`;
    return names.map(name => {
      const info = SELLERS[name];
      const lotsCount = this.products.filter(p => p.seller === name).length;
      const isFollowing = this.followedSellers.has(name);
      return `
        <div class="seller-card" style="margin:0 0 10px;">
          <a href="/seller/${encodeURIComponent(name)}" class="seller-card-avatar" style="text-decoration:none;">${name.slice(0, 2).toUpperCase()}</a>
          <div style="flex:1;">
            <a href="/seller/${encodeURIComponent(name)}" class="seller-card-name" style="text-decoration:none;">${this.sellerLine(name)}</a>
            <div class="seller-card-meta">${info.salesCount} ${this.t('seller_sales')} · ${this.t('seller_member_since')} ${2026 - info.yearsActive} · ${Math.round((info.rating / 5) * 100)}% ${this.t('seller_positive_pct')} · ${lotsCount} ${this.t('count_unit')}</div>
          </div>
          <button class="btn ${isFollowing ? 'btn-primary' : 'btn-ghost'}" style="font-size:0.6875rem; padding:7px 10px; flex-shrink:0;" data-action="toggle-follow-seller" data-seller="${name}">${isFollowing ? this.t('btn_unfollow_seller') : this.t('btn_follow_seller')}</button>
        </div>`;
    }).join('');
  },
  /** "Моя колекція" portfolio view (#"Личный кабинет коллекционера" feedback) — computes total value
      and growth from the buyer's own favorited lots' real price/investment fields, not invented numbers. */
  renderMyCollection(this: App): string {
    const items = this.products.filter(p => this.favorites.has(p.id) && (p.investmentRating || p.priceGrowthPct));
    if (items.length === 0) return `<p style="font-size:0.8125rem; color:var(--sage); padding:20px 0;">${this.t('empty_collection')}</p>`;

    const totalValue = items.reduce((sum, p) => sum + (p.saleType === 'auction' ? (p.currentBid ?? p.startPrice ?? 0) : (p.price ?? 0)), 0);
    const withGrowth = items.filter(p => p.priceGrowthPct);
    const avgGrowth = withGrowth.length ? Math.round(withGrowth.reduce((s, p) => s + (p.priceGrowthPct ?? 0), 0) / withGrowth.length) : null;

    const summary = `
      <div class="investment-card" style="margin-bottom:18px;">
        <div class="investment-row"><span>${this.t('label_collection_items')}</span><span class="mono">${items.length}</span></div>
        <div class="investment-row"><span>${this.t('label_collection_value')}</span><span class="mono" style="color:var(--brass-light);">${totalValue.toLocaleString('ru-RU')} ₴</span></div>
        ${avgGrowth !== null ? `<div class="investment-row"><span>${this.t('label_collection_growth')}</span><span class="mono" style="color:#4FA876;">+${avgGrowth}%</span></div>` : ''}
      </div>`;

    const rows = items.map(p => {
      const tr = this.getProductText(p);
      const price = p.saleType === 'auction' ? (p.currentBid ?? p.startPrice ?? 0) : (p.price ?? 0);
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--line); font-size:0.8125rem; cursor:pointer;" data-action="open-detail" data-id="${p.id}">
          <span>${tr.name} <span class="mono" style="color:var(--sage);">· LOT-0${p.id}</span></span>
          <span style="display:flex; align-items:center; gap:8px;">
            ${p.priceGrowthPct ? `<span class="mono" style="color:#4FA876; font-size:0.71875rem;">+${p.priceGrowthPct}%</span>` : ''}
            <span class="mono" style="color:var(--brass-light);">${price.toLocaleString('ru-RU')} ₴</span>
          </span>
        </div>`;
    }).join('');

    return summary + rows;
  },
  renderCabinetModal(this: App, tab: string): void {
    let body = '';
    const sellerTabs = ['my_lots', 'create'];
    const buyerTabs = ['my_bids', 'won_lots', 'purchases', 'favorites', 'sellers', 'collection'];
    if (this.dashboardRole === 'seller' && !sellerTabs.includes(tab) && tab !== 'wallet') tab = 'my_lots';
    if (this.dashboardRole === 'buyer' && !buyerTabs.includes(tab) && tab !== 'wallet') tab = 'my_bids';

    if (tab === 'create') {
      const editing = this.editingLotId !== null ? this.products.find(p => p.id === this.editingLotId) : undefined;
      const etr = editing ? this.getProductText(editing) : undefined;
      const iconOptions = (Object.keys(ICON_LABELS) as IconKey[])
        .map(k => `<option value="${k}" ${editing?.icon === k ? 'selected' : ''}>${ICON_LABELS[k][this.currentLang]}</option>`).join('');
      const catOpts: [Category, keyof typeof UI['uk']][] = [
        ['decor', 'tab_decor'], ['numismatics', 'tab_numismatics'], ['porcelain', 'tab_porcelain'], ['silver', 'tab_silver'],
        ['painting', 'tab_painting'], ['militaria', 'tab_militaria'], ['jewelry', 'tab_jewelry'], ['clocks', 'tab_clocks'],
        ['glass', 'tab_glass'], ['philately', 'tab_philately'], ['books', 'tab_books'], ['special', 'tab_vip'],
      ];
      const sellPrice = editing?.price ?? editing?.startPrice ?? 0;
      body = `
        ${editing ? `<div style="background:var(--accent-tint); border-radius:var(--radius); padding:10px 14px; margin-bottom:16px; font-size:0.8125rem; color:var(--brass-light);">${this.t('label_editing_lot')} LOT-0${editing.id}</div>` : ''}
        <div class="lot-form-grid">
          <div class="lot-media-col">
            <div class="field"><label>${this.t('field_lot_photo')}</label>
              <label class="file-input-wrap">
                <input id="newPhoto" type="file" accept="image/*" class="file-input-native" data-empty-label="${this.t('label_no_file_chosen')}">
                <span class="file-input-btn">${this.t('btn_choose_file')}</span>
                <span class="file-input-name">${this.t('label_no_file_chosen')}</span>
              </label>
            </div>
            ${editing?.photo ? `<img src="${editing.photo}" alt="" class="lot-media-preview">` : ''}
            <div class="field"><label>${this.t('field_lot_extra_photos')}</label>
              <label class="file-input-wrap">
                <input id="newExtraPhotos" type="file" accept="image/*" multiple class="file-input-native" data-empty-label="${this.t('label_no_file_chosen')}">
                <span class="file-input-btn">${this.t('btn_choose_file')}</span>
                <span class="file-input-name">${this.t('label_no_file_chosen')}</span>
              </label>
            </div>
            <div class="lot-media-hint">${this.t('hint_lot_extra_photos')}</div>
            <div class="field"><label>${this.t('field_lot_video')}</label><input id="newVideo" placeholder="https://youtube.com/watch?v=..." value="${editing?.videoUrl ?? ''}"></div>
            <div class="lot-media-hint">${this.t('hint_lot_video')}</div>
          </div>
          <div class="lot-fields-col">
            <div class="field"><label>${this.t('field_lot_name')}</label><input id="newName" value="${etr?.name ?? ''}"></div>
            <div class="field"><label>${this.t('field_lot_era')}</label><input id="newEra" placeholder="1900-1910" value="${etr?.era ?? ''}"></div>
            <div class="field"><label>${this.t('field_lot_icon')}</label><select id="newIcon">${iconOptions}</select></div>
            <div class="field"><label>${this.t('label_category')}</label>
              <select id="newCategory">
                ${catOpts.map(([val, key]) => `<option value="${val}" ${editing?.category === val ? 'selected' : ''}>${this.t(key)}</option>`).join('')}
              </select>
            </div>
            <div class="field"><label>${this.t('field_sale_type')}</label>
              <select id="newSaleType" data-action="sale-type-change">
                <option value="shop" ${editing?.saleType === 'shop' ? 'selected' : ''}>${this.t('opt_sale_shop')}</option>
                <option value="auction" ${editing?.saleType === 'auction' ? 'selected' : ''}>${this.t('opt_sale_auction')}</option>
                <option value="request" ${editing?.saleType === 'request' ? 'selected' : ''}>${this.t('opt_sale_request')}</option>
              </select>
            </div>
            <div class="field"><label>${this.t('label_material')}</label><input id="newMaterial" value="${editing?.custom?.material ?? ''}"></div>
            <div class="field"><label>${this.t('label_condition')}</label><input id="newCondition" value="${editing?.custom?.condition ?? ''}"></div>
            <div class="field"><label>${this.t('field_lot_desc')}</label><input id="newDesc" value="${etr?.desc ?? ''}"></div>
            <div class="field"><label>${this.t('field_lot_story')}</label><textarea id="newProvenance" rows="3" placeholder="${this.t('placeholder_lot_story')}" style="width:100%; background:var(--field-bg); border:1px solid var(--line); color:var(--ivory); border-radius:var(--radius); padding:11px 12px; font-family:'Karla',sans-serif; font-size:0.96875rem; resize:vertical;">${editing?.provenance?.uk ?? ''}</textarea></div>
            <div class="field" id="priceField"><label>${this.t('field_lot_price')}</label><input id="newPrice" type="number" min="0" value="${editing?.price ?? ''}" data-action="commission-input"></div>
            <div class="field" id="startPriceField" style="display:${editing?.saleType === 'auction' ? '' : 'none'};"><label>${this.t('field_start_price')}</label><input id="newStartPrice" type="number" min="0" value="${editing?.startPrice ?? ''}" data-action="commission-input"></div>
            <div class="field" id="durationField" style="display:${editing?.saleType === 'auction' ? '' : 'none'};"><label>${this.t('field_duration')}</label>
              <select id="newDuration">
                <option value="1">1 ${this.currentLang === 'en' ? 'day' : this.currentLang === 'pl' ? 'dzień' : 'день'}</option>
                <option value="3">3 ${this.currentLang === 'en' ? 'days' : this.currentLang === 'pl' ? 'dni' : 'дні'}</option>
                <option value="7">7 ${this.currentLang === 'en' ? 'days' : this.currentLang === 'pl' ? 'dni' : 'днів'}</option>
              </select>
            </div>
            <div class="commission-box" id="commissionBox">${this.commissionBoxHtml(sellPrice)}</div>
            <div style="display:flex; gap:10px;">
              ${editing ? `<button class="btn btn-ghost" style="flex:1; justify-content:center;" data-action="cancel-edit-listing">${this.t('btn_cancel')}</button>` : ''}
              <button class="btn btn-primary" style="flex:2; justify-content:center; margin-top:${editing ? '0' : '6px'};" data-action="publish-listing">${editing ? this.t('btn_save_changes') : this.t('btn_publish')}</button>
            </div>
          </div>
        </div>
      `;
    } else if (tab === 'purchases') {
      body = this.purchaseHistory.length === 0
        ? `<p style="font-size:0.8125rem; color:var(--sage); padding:20px 0;">${this.t('empty_purchases')}</p>`
        : this.purchaseHistory.map(o => `
          <div style="padding:10px 0; border-bottom:1px solid var(--line); font-size:0.8125rem;">
            <div class="mono" style="color:var(--sage); margin-bottom:3px;">${o.date}</div>
            <div>${o.itemNames}</div>
            <div class="mono" style="color:var(--brass-light); margin-top:3px;">${o.total.toLocaleString('ru-RU')} ₴</div>
          </div>
        `).join('');
    } else if (tab === 'my_bids') {
      body = this.renderMyBids();
    } else if (tab === 'won_lots') {
      body = this.renderWonLots();
    } else if (tab === 'favorites') {
      body = this.renderFavoritesTab();
    } else if (tab === 'sellers') {
      body = this.renderSellersTab();
    } else if (tab === 'collection') {
      body = this.renderMyCollection();
    } else if (tab === 'wallet') {
      body = this.renderWallet();
    } else {
      tab = 'my_lots';
      const mine = this.products.filter(p => p.seller === this.currentUser);
      body = mine.length === 0
        ? `<p style="font-size:0.8125rem; color:var(--sage); padding:20px 0;">${this.t('empty_my_lots')}</p>`
        : mine.map(p => {
          const tr = this.getProductText(p);
          // Demo analytics: real watcher/bid counts when present, plus a deterministic "views" figure
          // (a stand-in for real page-view analytics, which would need a backend to track honestly).
          const views = 40 + ((p.id * 47) % 260);
          const interestLabel = p.saleType === 'auction'
            ? `${p.watchingNow ?? 0} ${this.t('label_watching_now')} · ${p.bidsCount ?? 0} ${this.t('label_bids_count')}`
            : `${this.favorites.has(p.id) ? 1 : 0} ${this.t('tab_my_favorites').toLowerCase()}`;
          return `
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; padding:10px 0; border-bottom:1px solid var(--line); font-size:0.8125rem;">
            <div>
              <div>${tr.name} <span class="mono" style="color:var(--sage);">· LOT-0${p.id}</span></div>
              <div class="mono" style="color:var(--sage); font-size:0.71875rem; margin-top:4px;">${views} ${this.t('label_views')} · ${interestLabel}</div>
            </div>
            <div style="display:flex; gap:6px; flex-shrink:0;">
              <button class="btn btn-ghost" style="font-size:0.71875rem; padding:6px 10px;" data-action="edit-listing" data-id="${p.id}">${this.t('btn_edit_listing')}</button>
              <button class="cart-remove" data-action="remove-listing" data-id="${p.id}">${this.t('btn_remove_listing')}</button>
            </div>
          </div>`;
        }).join('');
    }

    const tabsForRole = this.dashboardRole === 'seller'
      ? `<button class="tab ${tab === 'my_lots' ? 'active' : ''}" data-action="cabinet-tab" data-tab="my_lots">${this.t('tab_my_lots')}</button>
         <button class="tab ${tab === 'create' ? 'active' : ''}" data-action="cabinet-tab" data-tab="create">${this.t('tab_create')}</button>
         <button class="tab ${tab === 'wallet' ? 'active' : ''}" data-action="cabinet-tab" data-tab="wallet">${this.t('tab_wallet')}</button>`
      : `<button class="tab ${tab === 'my_bids' ? 'active' : ''}" data-action="cabinet-tab" data-tab="my_bids">${this.t('tab_my_bids')}</button>
         <button class="tab ${tab === 'won_lots' ? 'active' : ''}" data-action="cabinet-tab" data-tab="won_lots">${this.t('tab_won_lots')}</button>
         <button class="tab ${tab === 'purchases' ? 'active' : ''}" data-action="cabinet-tab" data-tab="purchases">${this.t('tab_purchases')}</button>
         <button class="tab ${tab === 'favorites' ? 'active' : ''}" data-action="cabinet-tab" data-tab="favorites">${this.t('tab_my_favorites')}</button>
         <button class="tab ${tab === 'collection' ? 'active' : ''}" data-action="cabinet-tab" data-tab="collection">${this.t('tab_my_collection')}</button>
         <button class="tab ${tab === 'sellers' ? 'active' : ''}" data-action="cabinet-tab" data-tab="sellers">${this.t('tab_my_sellers')}</button>
         <button class="tab ${tab === 'wallet' ? 'active' : ''}" data-action="cabinet-tab" data-tab="wallet">${this.t('tab_wallet')}</button>`;

    // Create-lot form needs real room for the two-column media/fields layout — every other tab
    // keeps the standard compact width.
    $('checkoutCard').classList.toggle('wide', tab === 'create');
    $('checkoutCard').classList.toggle('lot-form-card', tab === 'create');

    $('checkoutCard').innerHTML = `
      <h3>${this.t('cabinet_title')}</h3>
      <div class="sub">${this.t('logged_in_as')} ${this.currentUser} · <a href="#" data-action="logout" style="color:var(--oxblood);">${this.t('btn_logout')}</a></div>
      ${this.renderRoleToggle()}
      <div class="tabs" style="margin:0 0 16px;">${tabsForRole}</div>
      <div>${body}</div>
      <button class="btn btn-ghost" style="width:100%; justify-content:center; margin-top:16px;" data-action="close-checkout">${this.t('btn_close')}</button>
    `;
  },
  setRole(this: App, role: DashboardRole): void {
    this.dashboardRole = role;
    this.savePreference('vh_role', role);
    this.openCabinet(role === 'seller' ? 'my_lots' : 'my_bids');
  },
  commissionBoxHtml(this: App, price: number): string {
    const fee = Math.round(price * this.platformFeePct / 100);
    const net = price - fee;
    return `
      <div class="commission-row"><span>${this.t('label_sale_price')}</span><span class="mono">${price.toLocaleString('ru-RU')} ₴</span></div>
      <div class="commission-row"><span>${this.t('label_platform_fee')} (${this.platformFeePct}%)</span><span class="mono" style="color:var(--oxblood);">−${fee.toLocaleString('ru-RU')} ₴</span></div>
      <div class="commission-row commission-net"><span>${this.t('label_net_payout')}</span><span class="mono">${net.toLocaleString('ru-RU')} ₴</span></div>
    `;
  },
  updateCommissionBox(this: App): void {
    const box = document.getElementById('commissionBox');
    if (!box) return;
    const saleType = document.getElementById('newSaleType') as HTMLSelectElement | null;
    const priceInput = saleType?.value === 'auction'
      ? document.getElementById('newStartPrice') as HTMLInputElement | null
      : document.getElementById('newPrice') as HTMLInputElement | null;
    const price = parseInt(priceInput?.value ?? '0', 10) || 0;
    box.innerHTML = this.commissionBoxHtml(price);
  },
  /** Opens the create-lot form pre-filled with an existing lot's data (#"критично добавить" — edit own lot). */
  editListing(this: App, id: number): void {
    this.editingLotId = id;
    this.openCabinet('create');
  },
  cancelEditListing(this: App): void {
    this.editingLotId = null;
    this.openCabinet('my_lots');
  },
  removeListing(this: App, id: number): void {
    this.products = this.products.filter(p => p.id !== id);
    this.renderCatalog();
    this.openCabinet('my_lots');
  },
  handleSaleTypeChange(this: App): void {
    const val = $<HTMLSelectElement>('newSaleType').value as SaleType;
    $('priceField').style.display = val === 'shop' ? '' : 'none';
    $('startPriceField').style.display = val === 'auction' ? '' : 'none';
    $('durationField').style.display = val === 'auction' ? '' : 'none';
    this.updateCommissionBox();
  },
  publishListing(this: App): void {
    const name = $<HTMLInputElement>('newName').value.trim();
    const era = $<HTMLInputElement>('newEra').value.trim();
    const icon = $<HTMLSelectElement>('newIcon').value as IconKey;
    const category = $<HTMLSelectElement>('newCategory').value as Category;
    const saleType = $<HTMLSelectElement>('newSaleType').value as SaleType;
    const material = $<HTMLInputElement>('newMaterial').value.trim();
    const condition = $<HTMLInputElement>('newCondition').value.trim();
    const desc = $<HTMLInputElement>('newDesc').value.trim();
    const videoUrl = $<HTMLInputElement>('newVideo').value.trim();
    const story = $<HTMLTextAreaElement>('newProvenance').value.trim();
    const photoInput = $<HTMLInputElement>('newPhoto');
    const extraPhotosInput = $<HTMLInputElement>('newExtraPhotos');

    if (!name) { alert(this.itemNameRequiredLabel()); return; }

    const editingId = this.editingLotId;

    const readAsDataUrl = (file: File): Promise<string> => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.readAsDataURL(file);
    });

    const finish = (photoData: string | null, extraPhotosData: string[] | null) => {
      const id = editingId ?? this.nextLotId++;
      const existingForPhoto = editingId !== null ? this.products.find(p => p.id === editingId) : undefined;
      const product: Product = {
        ...(existingForPhoto ?? {}),
        id, icon, category, seller: this.currentUser ?? '', saleType,
        photo: photoData ?? existingForPhoto?.photo ?? null,
        extraPhotos: extraPhotosData ?? existingForPhoto?.extraPhotos,
        videoUrl: videoUrl || existingForPhoto?.videoUrl || null,
        custom: { name, era, desc, material, condition }
      };
      if (story) {
        // Single-language demo input (no per-language translation UI in the form) — mirrored across
        // all four languages so existing display code (which keys off currentLang) shows it everywhere.
        product.provenance = { uk: story, en: story, pl: story, ru: story };
      }

      if (saleType === 'shop') {
        const priceNum = parseInt($<HTMLInputElement>('newPrice').value.trim(), 10);
        if (isNaN(priceNum)) { alert(this.priceRequiredLabel()); return; }
        product.price = priceNum;
      } else if (saleType === 'auction') {
        const startNum = parseInt($<HTMLInputElement>('newStartPrice').value.trim(), 10);
        if (isNaN(startNum)) { alert(this.priceRequiredLabel()); return; }
        const days = parseInt($<HTMLSelectElement>('newDuration').value, 10);
        const existing = editingId !== null ? this.products.find(p => p.id === editingId) : undefined;
        product.startPrice = startNum;
        product.currentBid = existing?.currentBid ?? startNum;
        product.bidStep = Math.max(50, Math.round(startNum * 0.05 / 50) * 50);
        product.bidsCount = existing?.bidsCount ?? 0;
        product.bidHistory = existing?.bidHistory ?? [];
        product.endTime = existing?.endTime ?? new Date(Date.now() + days * 86400000).toISOString();
      }

      if (editingId !== null) {
        const idx = this.products.findIndex(p => p.id === editingId);
        if (idx !== -1) this.products[idx] = product;
        this.editingLotId = null;
      } else {
        this.products.push(product);
      }
      this.renderCatalog();
      this.openCabinet('my_lots');
    };

    const file = photoInput.files?.[0] ?? null;
    const extraFiles = extraPhotosInput.files ? Array.from(extraPhotosInput.files) : [];

    Promise.all([
      file ? readAsDataUrl(file) : Promise.resolve(null),
      extraFiles.length ? Promise.all(extraFiles.map(readAsDataUrl)) : Promise.resolve(null),
    ]).then(([photoData, extraPhotosData]) => finish(photoData, extraPhotosData));
  },
};
