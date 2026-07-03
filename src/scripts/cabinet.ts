import type { VintageHallApp as App } from './app';
import { $ } from './dom-utils';
import { ICON_LABELS, SELLERS } from '../data/products';
import { UI } from '../data/i18n';
import type { IconKey, Category, DashboardRole, SaleType, Product, Lang } from '../types';
import { AUTH_T, AUTH_COUNTRIES, AUTH_PHONE_CODES } from './auth-texts';
import { findUser, updateUser, addUser } from './auth-store';

/** Cabinet copy that isn't in the main UI dict — Violity-style menu groups and the
    settings/password/messages/reviews sections added with the account rework. */
const CAB_T: Record<string, Record<Lang, string>> = {
  cab_title: { uk: 'Мій кабінет', en: 'My account', pl: 'Moje konto', ru: 'Мой кабинет' },
  group_buy: { uk: 'Покупки', en: 'Buying', pl: 'Zakupy', ru: 'Покупки' },
  group_sell: { uk: 'Продаж', en: 'Selling', pl: 'Sprzedaż', ru: 'Продажа' },
  group_account: { uk: 'Рахунок', en: 'Account', pl: 'Rachunek', ru: 'Счёт' },
  group_settings: { uk: 'Налаштування', en: 'Settings', pl: 'Ustawienia', ru: 'Настройки' },
  menu_messages: { uk: 'Повідомлення', en: 'Messages', pl: 'Wiadomości', ru: 'Сообщения' },
  menu_reviews: { uk: 'Відгуки', en: 'Reviews', pl: 'Opinie', ru: 'Отзывы' },
  menu_settings: { uk: 'Особисті дані', en: 'Personal details', pl: 'Dane osobowe', ru: 'Личные данные' },
  menu_password: { uk: 'Зміна пароля', en: 'Change password', pl: 'Zmiana hasła', ru: 'Смена пароля' },
  member_since: { uk: 'На аукціоні з', en: 'Member since', pl: 'Na aukcji od', ru: 'На аукционе с' },
  reviews_label: { uk: 'Відгуки', en: 'Reviews', pl: 'Opinie', ru: 'Отзывы' },
  empty_messages: {
    uk: 'Повідомлень поки немає. Напишіть продавцю на сторінці лота — діалог з\'явиться тут.',
    en: 'No messages yet. Write to a seller on a lot page — the conversation will appear here.',
    pl: 'Brak wiadomości. Napisz do sprzedawcy na stronie lotu — rozmowa pojawi się tutaj.',
    ru: 'Сообщений пока нет. Напишите продавцу на странице лота — диалог появится здесь.',
  },
  reviews_summary: { uk: 'Діловий рейтинг', en: 'Business rating', pl: 'Rating biznesowy', ru: 'Деловой рейтинг' },
  reviews_positive: { uk: 'позитивних', en: 'positive', pl: 'pozytywnych', ru: 'положительных' },
  reviews_negative: { uk: 'негативних', en: 'negative', pl: 'negatywnych', ru: 'отрицательных' },
  reviews_none: {
    uk: 'Відгуків поки немає — вони з\'являться після завершених угод.',
    en: 'No reviews yet — they will appear after completed deals.',
    pl: 'Brak opinii — pojawią się po zakończonych transakcjach.',
    ru: 'Отзывов пока нет — они появятся после завершённых сделок.',
  },
  field_city: { uk: 'Місто', en: 'City', pl: 'Miasto', ru: 'Город' },
  field_address: { uk: 'Адреса доставки (відділення НП)', en: 'Delivery address', pl: 'Adres dostawy', ru: 'Адрес доставки (отделение НП)' },
  field_login_ro: { uk: 'Логін (не змінюється)', en: 'Login (cannot be changed)', pl: 'Login (nie można zmienić)', ru: 'Логин (не меняется)' },
  btn_save: { uk: 'Зберегти', en: 'Save', pl: 'Zapisz', ru: 'Сохранить' },
  saved_toast: { uk: 'Дані збережено', en: 'Details saved', pl: 'Dane zapisane', ru: 'Данные сохранены' },
  pw_current: { uk: 'Поточний пароль', en: 'Current password', pl: 'Obecne hasło', ru: 'Текущий пароль' },
  pw_new: { uk: 'Новий пароль', en: 'New password', pl: 'Nowe hasło', ru: 'Новый пароль' },
  pw_repeat: { uk: 'Повторіть новий пароль', en: 'Repeat new password', pl: 'Powtórz nowe hasło', ru: 'Повторите новый пароль' },
  pw_changed: { uk: 'Пароль змінено', en: 'Password changed', pl: 'Hasło zmienione', ru: 'Пароль изменён' },
  pw_wrong: { uk: 'Поточний пароль невірний', en: 'Current password is wrong', pl: 'Obecne hasło jest błędne', ru: 'Текущий пароль неверный' },
  pw_len: { uk: 'Новий пароль: від 6 до 12 символів', en: 'New password: 6 to 12 characters', pl: 'Nowe hasło: od 6 do 12 znaków', ru: 'Новый пароль: от 6 до 12 символов' },
  pw_match: { uk: 'Нові паролі не збігаються', en: 'New passwords do not match', pl: 'Nowe hasła nie są zgodne', ru: 'Новые пароли не совпадают' },
  legacy_note: {
    uk: 'Ваш акаунт створено за старою схемою (без пароля). Заповніть дані та збережіть — після цього можна встановити пароль.',
    en: 'Your account was created the old way (no password). Fill in and save your details — then you can set a password.',
    pl: 'Twoje konto utworzono starym sposobem (bez hasła). Uzupełnij i zapisz dane — potem możesz ustawić hasło.',
    ru: 'Ваш аккаунт создан по старой схеме (без пароля). Заполните данные и сохраните — после этого можно установить пароль.',
  },
  btn_logout_menu: { uk: 'Вийти з кабінету', en: 'Sign out', pl: 'Wyloguj się', ru: 'Выйти из кабинета' },
};

declare module './app' {
  interface VintageHallApp {
  openLogin(afterTab: string): void;
  logout(): void;
  openCabinet(tab: string): void;
  cabT(key: string): string;
  itemNameRequiredLabel(): string;
  priceRequiredLabel(): string;
  renderWallet(): string;
  renderMyBids(): string;
  renderWonLots(): string;
  renderFavoritesTab(): string;
  renderSellersTab(): string;
  renderMyCollection(): string;
  renderSavedSearchesTab(): string;
  renderSettingsTab(): string;
  renderPasswordTab(): string;
  renderMessagesTab(): string;
  renderReviewsTab(): string;
  cabinetBody(tab: string): string;
  renderCabinet(tab: string): void;
  saveProfileSettings(): void;
  changePassword(): void;
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
  cabT(this: App, key: string): string {
    return CAB_T[key]?.[this.currentLang] ?? CAB_T[key]?.uk ?? key;
  },
  /** Sends the visitor to the standalone Violity-style /login page; ?after= brings them
      back to the requested cabinet section once signed in. */
  openLogin(this: App, afterTab: string): void {
    window.location.href = `/login?after=${encodeURIComponent(afterTab)}`;
  },
  logout(this: App): void {
    this.currentUser = null;
    this.clearSavedUser();
    window.location.href = '/';
  },
  /** The cabinet is a full page now (Violity-style, /cabinet) — from any other page this
      navigates there; on the cabinet page itself it re-renders in place. */
  openCabinet(this: App, tab: string): void {
    if (!document.getElementById('cabinetRoot')) {
      window.location.href = `/cabinet?tab=${encodeURIComponent(tab)}`;
      return;
    }
    this.currentLotDetailId = null;
    this.renderCabinet(tab);
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
  renderWallet(this: App): string {
    return `
      <div style="background:var(--accent-tint); border-radius:var(--radius); padding:16px; margin-bottom:14px;">
        <div style="font-size:0.75rem; color:var(--sage); text-transform:uppercase; letter-spacing:0.05em;">${this.t('wallet_balance')}</div>
        <div class="mono" style="font-size:1.5rem; color:var(--brass-light); margin-top:4px;">${this.walletBalance.toLocaleString('uk-UA')} ₴</div>
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
          <span class="mono" style="color:${statusColor};">${statusText} · ${(p.currentBid ?? 0).toLocaleString('uk-UA')} ₴</span>
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
      return `<div style="padding:10px 0; border-bottom:1px solid var(--line); font-size:0.8125rem;">${tr.name} — ${(p.currentBid ?? 0).toLocaleString('uk-UA')} ₴</div>`;
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
          <span class="mono" style="color:var(--brass-light);">${priceLabel.toLocaleString('uk-UA')} ₴</span>
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
        <div class="investment-row"><span>${this.t('label_collection_value')}</span><span class="mono" style="color:var(--brass-light);">${totalValue.toLocaleString('uk-UA')} ₴</span></div>
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
            <span class="mono" style="color:var(--brass-light);">${price.toLocaleString('uk-UA')} ₴</span>
          </span>
        </div>`;
    }).join('');

    return summary + rows;
  },
  /** "Збережені пошуки" cabinet tab — saved via the bell button next to the search input
      (CatalogSection.astro). Shows real lot counts, not a fabricated notification badge. */
  renderSavedSearchesTab(this: App): string {
    if (this.savedSearches.length === 0) return `<p style="font-size:0.8125rem; color:var(--sage); padding:20px 0;">${this.t('empty_saved_searches')}</p>`;
    return this.savedSearches.map(s => {
      const currentCount = this.matchSavedSearchCount(s.category, s.query);
      const newCount = Math.max(0, currentCount - s.matchCountAtSave);
      const countLabel = newCount > 0
        ? `<span class="mono" style="color:var(--oxblood);">+${newCount} ${this.t('label_new_matches')}</span>`
        : `<span class="mono" style="color:var(--sage);">${currentCount}</span>`;
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--line); font-size:0.8125rem; cursor:pointer;" data-action="apply-saved-search" data-search-id="${s.id}">
          <span>${s.label}</span>
          <span style="display:flex; align-items:center; gap:10px; flex-shrink:0;">
            ${countLabel}
            <button class="cart-remove" data-action="remove-saved-search" data-search-id="${s.id}">${this.t('cart_remove')}</button>
          </span>
        </div>`;
    }).join('');
  },
  /** Builds the inner HTML of one cabinet section (the right-hand content column). */
  cabinetBody(this: App, tab: string): string {
    let body = '';
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
            <div class="mono" style="color:var(--brass-light); margin-top:3px;">${o.total.toLocaleString('uk-UA')} ₴</div>
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
    } else if (tab === 'saved_searches') {
      body = this.renderSavedSearchesTab();
    } else if (tab === 'wallet') {
      body = this.renderWallet();
    } else if (tab === 'messages') {
      body = this.renderMessagesTab();
    } else if (tab === 'reviews') {
      body = this.renderReviewsTab();
    } else if (tab === 'settings') {
      body = this.renderSettingsTab();
    } else if (tab === 'password') {
      body = this.renderPasswordTab();
    } else {
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

    return body;
  },

  /** «Повідомлення» — buyer-seller lot chats collected in one inbox, like Violity's messages. */
  renderMessagesTab(this: App): string {
    const entries = Object.entries(this.lotChatMessages).filter(([, msgs]) => msgs.length > 0);
    if (entries.length === 0) return `<p class="cab-empty">${this.cabT('empty_messages')}</p>`;
    return entries.map(([idStr, msgs]) => {
      const p = this.products.find(x => x.id === Number(idStr));
      const name = p ? this.getProductText(p).name : `LOT-0${idStr}`;
      const last = msgs[msgs.length - 1];
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--line); font-size:0.8125rem; cursor:pointer;" data-action="open-detail" data-id="${idStr}">
          <span>${name} <span class="mono" style="color:var(--sage);">· LOT-0${idStr}</span></span>
          <span style="color:var(--sage); font-size:0.75rem;">${last.user}: ${last.text.slice(0, 48)}</span>
        </div>`;
    }).join('');
  },

  /** «Відгуки» — Violity-style business rating (+N/−N). Honest zeros until real completed
      deals produce reviews; the block exists so the mechanic is visible in the cabinet. */
  renderReviewsTab(this: App): string {
    return `
      <div class="investment-card" style="margin-bottom:18px;">
        <div class="investment-row"><span>${this.cabT('reviews_summary')}</span><span class="mono">0</span></div>
        <div class="investment-row"><span>${this.cabT('reviews_positive')}</span><span class="mono" style="color:#1D9E75;">+0</span></div>
        <div class="investment-row"><span>${this.cabT('reviews_negative')}</span><span class="mono" style="color:var(--oxblood);">−0</span></div>
      </div>
      <p class="cab-empty">${this.cabT('reviews_none')}</p>`;
  },

  /** «Особисті дані» — profile form backed by the auth-store registry (auth-store.ts). */
  renderSettingsTab(this: App): string {
    const stored = this.currentUser ? findUser(this.currentUser) : undefined;
    const at = (k: string) => AUTH_T[k]?.[this.currentLang] ?? AUTH_T[k]?.uk ?? k;
    const countryOpts = AUTH_COUNTRIES
      .map(c => `<option value="${c.code}" ${stored?.country === c.code ? 'selected' : ''}>${c.label[this.currentLang]}</option>`).join('');
    const codeOpts = AUTH_PHONE_CODES
      .map(c => `<option value="${c}" ${(stored?.phoneCode ?? '+380') === c ? 'selected' : ''}>${c}</option>`).join('');
    return `
      ${!stored ? `<div class="cab-note">${this.cabT('legacy_note')}</div>` : ''}
      <div class="field"><label>${this.cabT('field_login_ro')}</label><input value="${this.currentUser ?? ''}" disabled></div>
      <div class="field"><label>${at('field_fullname')}</label><input id="setFullName" maxlength="80" value="${stored?.fullName ?? ''}"></div>
      <div class="field"><label>${at('field_email')}</label><input id="setEmail" type="email" value="${stored?.email ?? ''}"></div>
      <div class="field"><label>${at('field_phone')}</label>
        <div style="display:flex; gap:8px;">
          <select id="setPhoneCode" style="width:96px; flex-shrink:0;">${codeOpts}</select>
          <input id="setPhone" type="tel" style="flex:1;" value="${stored?.phone ?? ''}">
        </div>
      </div>
      <div class="field"><label>${at('field_country')}</label><select id="setCountry">${countryOpts}</select></div>
      <div class="field"><label>${this.cabT('field_city')}</label><input id="setCity" value="${stored?.city ?? ''}"></div>
      <div class="field"><label>${this.cabT('field_address')}</label><input id="setAddress" value="${stored?.address ?? ''}"></div>
      <button class="btn btn-primary" style="margin-top:6px;" data-action="save-profile">${this.cabT('btn_save')}</button>`;
  },

  saveProfileSettings(this: App): void {
    if (!this.currentUser) return;
    const patch = {
      fullName: $<HTMLInputElement>('setFullName').value.trim(),
      email: $<HTMLInputElement>('setEmail').value.trim(),
      phoneCode: $<HTMLSelectElement>('setPhoneCode').value,
      phone: $<HTMLInputElement>('setPhone').value.trim(),
      country: $<HTMLSelectElement>('setCountry').value,
      city: $<HTMLInputElement>('setCity').value.trim(),
      address: $<HTMLInputElement>('setAddress').value.trim(),
    };
    const updated = updateUser(this.currentUser, patch);
    if (!updated) {
      // Account from the old name-only login — give it a registry entry so settings persist.
      addUser({ login: this.currentUser, password: '', regDate: new Date().toISOString(), ...patch });
    }
    this.showToast(this.cabT('saved_toast'));
    this.renderCabinet('settings');
  },

  /** «Зміна пароля» — verifies the current password against the registry before changing. */
  renderPasswordTab(this: App): string {
    const stored = this.currentUser ? findUser(this.currentUser) : undefined;
    const hasPassword = !!stored?.password;
    return `
      ${!stored ? `<div class="cab-note">${this.cabT('legacy_note')}</div>` : ''}
      ${hasPassword ? `<div class="field"><label>${this.cabT('pw_current')}</label><input id="pwCurrent" type="password" maxlength="12"></div>` : ''}
      <div class="field"><label>${this.cabT('pw_new')}</label><input id="pwNew" type="password" maxlength="12"></div>
      <div class="field"><label>${this.cabT('pw_repeat')}</label><input id="pwRepeat" type="password" maxlength="12"></div>
      <div class="af-err" id="pwErr" style="margin-bottom:12px;"></div>
      <button class="btn btn-primary" data-action="change-password" ${!stored ? 'disabled' : ''}>${this.cabT('btn_save')}</button>`;
  },

  changePassword(this: App): void {
    if (!this.currentUser) return;
    const stored = findUser(this.currentUser);
    if (!stored) return;
    const errBox = document.getElementById('pwErr');
    const put = (msg: string) => { if (errBox) errBox.textContent = msg; };
    if (stored.password) {
      if ($<HTMLInputElement>('pwCurrent').value !== stored.password) { put(this.cabT('pw_wrong')); return; }
    }
    const next = $<HTMLInputElement>('pwNew').value;
    if (next.length < 6 || next.length > 12) { put(this.cabT('pw_len')); return; }
    if (next !== $<HTMLInputElement>('pwRepeat').value) { put(this.cabT('pw_match')); return; }
    updateUser(stored.login, { password: next });
    this.showToast(this.cabT('pw_changed'));
    this.renderCabinet('password');
  },

  /** Full-page cabinet (Violity's «Мій кабінет»): profile card + grouped sidebar menu on the
      left, active section on the right. Renders into #cabinetRoot on /cabinet. */
  renderCabinet(this: App, tab: string): void {
    const root = document.getElementById('cabinetRoot');
    if (!root || !this.currentUser) return;
    const allTabs = ['messages', 'reviews', 'my_bids', 'won_lots', 'purchases', 'favorites', 'collection',
      'sellers', 'saved_searches', 'my_lots', 'create', 'wallet', 'settings', 'password'];
    if (!allTabs.includes(tab)) tab = 'my_bids';
    try { history.replaceState(null, '', `/cabinet?tab=${tab}`); } catch { /* ignore */ }

    const stored = findUser(this.currentUser);
    const regDate = new Date(stored?.regDate ?? Date.now()).toLocaleDateString('uk-UA');
    const item = (id: string, label: string) =>
      `<button class="cab-menu-item ${tab === id ? 'active' : ''}" data-action="cabinet-tab" data-tab="${id}">${label}</button>`;
    const group = (label: string, items: string) =>
      `<div class="cab-menu-group"><div class="cab-menu-heading">${label}</div>${items}</div>`;

    const titles: Record<string, string> = {
      messages: this.cabT('menu_messages'), reviews: this.cabT('menu_reviews'),
      my_bids: this.t('tab_my_bids'), won_lots: this.t('tab_won_lots'), purchases: this.t('tab_purchases'),
      favorites: this.t('tab_my_favorites'), collection: this.t('tab_my_collection'), sellers: this.t('tab_my_sellers'),
      saved_searches: this.t('tab_saved_searches'), my_lots: this.t('tab_my_lots'), create: this.t('tab_create'),
      wallet: this.t('tab_wallet'), settings: this.cabT('menu_settings'), password: this.cabT('menu_password'),
    };

    root.innerHTML = `
      <div class="cab-layout">
        <aside class="cab-sidebar">
          <div class="cab-profile">
            <div class="cab-avatar">${this.currentUser.slice(0, 2).toUpperCase()}</div>
            <div class="cab-profile-info">
              <div class="cab-nick">${this.currentUser}</div>
              ${stored?.fullName ? `<div class="cab-fullname">${stored.fullName}</div>` : ''}
              <div class="cab-meta">${this.cabT('member_since')} ${regDate}</div>
              <div class="cab-meta">${this.cabT('reviews_label')}: <span style="color:#1D9E75;">+0</span> · <span style="color:var(--oxblood);">−0</span></div>
            </div>
          </div>
          <button class="cab-balance" data-action="cabinet-tab" data-tab="wallet">
            <span>${this.t('wallet_balance')}</span>
            <span class="mono">${this.walletBalance.toLocaleString('uk-UA')} ₴</span>
          </button>
          <nav class="cab-menu">
            ${item('messages', this.cabT('menu_messages'))}
            ${item('reviews', this.cabT('menu_reviews'))}
            ${group(this.cabT('group_buy'),
              item('my_bids', this.t('tab_my_bids')) +
              item('won_lots', this.t('tab_won_lots')) +
              item('purchases', this.t('tab_purchases')) +
              item('favorites', this.t('tab_my_favorites')) +
              item('collection', this.t('tab_my_collection')) +
              item('sellers', this.t('tab_my_sellers')) +
              item('saved_searches', this.t('tab_saved_searches')))}
            ${group(this.cabT('group_sell'),
              item('my_lots', this.t('tab_my_lots')) +
              item('create', this.t('tab_create')))}
            ${group(this.cabT('group_account'), item('wallet', this.t('tab_wallet')))}
            ${group(this.cabT('group_settings'),
              item('settings', this.cabT('menu_settings')) +
              item('password', this.cabT('menu_password')))}
            <button class="cab-menu-item cab-logout" data-action="logout">${this.cabT('btn_logout_menu')}</button>
          </nav>
        </aside>
        <section class="cab-content">
          <h1 class="cab-title">${titles[tab]}</h1>
          <div id="cabinetContent">${this.cabinetBody(tab)}</div>
        </section>
      </div>`;
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
      <div class="commission-row"><span>${this.t('label_sale_price')}</span><span class="mono">${price.toLocaleString('uk-UA')} ₴</span></div>
      <div class="commission-row"><span>${this.t('label_platform_fee')} (${this.platformFeePct}%)</span><span class="mono" style="color:var(--oxblood);">−${fee.toLocaleString('uk-UA')} ₴</span></div>
      <div class="commission-row commission-net"><span>${this.t('label_net_payout')}</span><span class="mono">${net.toLocaleString('uk-UA')} ₴</span></div>
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
