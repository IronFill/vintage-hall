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
  menu_home: { uk: 'Головна', en: 'Overview', pl: 'Główna', ru: 'Главная' },
  rating_label: { uk: 'Рейтинг', en: 'Rating', pl: 'Rating', ru: 'Рейтинг' },
  rating_hint: { uk: 'продавець | покупець', en: 'seller | buyer', pl: 'sprzedawca | kupujący', ru: 'продавец | покупатель' },
  dash_reviews_title: { uk: 'Оцінки контрагентів', en: 'Counterparty ratings', pl: 'Oceny kontrahentów', ru: 'Оценки контрагентов' },
  dash_no_reviews: { uk: 'Немає оцінок по угодах', en: 'No deal ratings yet', pl: 'Brak ocen transakcji', ru: 'Нет оценок по сделкам' },
  dash_active_lots: { uk: 'Активні лоти', en: 'Active lots', pl: 'Aktywne loty', ru: 'Активные лоты' },
  dash_no_lots: { uk: 'Немає лотів у продажу', en: 'No lots on sale', pl: 'Brak lotów w sprzedaży', ru: 'Нет лотов в продаже' },
  dash_no_favorites: { uk: 'Немає обраних лотів', en: 'No favorite lots', pl: 'Brak ulubionych lotów', ru: 'Нет избранных лотов' },
  dash_view_all: { uk: 'Переглянути всі', en: 'View all', pl: 'Zobacz wszystkie', ru: 'Посмотреть все' },

  // «Додавання лоту» — Violity-style create form
  create_required_note: {
    uk: "Поля, помічені * є обов'язковими для заповнення.",
    en: 'Fields marked * are required.',
    pl: 'Pola oznaczone * są wymagane.',
    ru: 'Поля, отмеченные * обязательны для заполнения.',
  },
  btn_clear_form: { uk: 'Очистити форму', en: 'Clear the form', pl: 'Wyczyść formularz', ru: 'Очистить форму' },
  sec_place_name: { uk: 'Розділ та назва лоту', en: 'Section and lot title', pl: 'Dział i nazwa lotu', ru: 'Раздел и название лота' },
  hint_category: {
    uk: 'Оберіть, будь ласка, розділ каталогу, в якому колекціонери шукатимуть предмет, що виставляється на торгівлю.',
    en: 'Please choose the catalog section where collectors will look for the item you are listing.',
    pl: 'Wybierz dział katalogu, w którym kolekcjonerzy będą szukać wystawianego przedmiotu.',
    ru: 'Выберите, пожалуйста, раздел каталога, в котором коллекционеры будут искать выставляемый предмет.',
  },
  hint_name: {
    uk: 'В назві лоту вказуйте найважливіші нюанси лоту: назву предмету, кількість. Не забувайте про правила сайту.',
    en: 'In the lot title state the essentials: the item name, quantity. Mind the site rules.',
    pl: 'W nazwie lotu podawaj najważniejsze szczegóły: nazwę przedmiotu, ilość. Pamiętaj o regulaminie.',
    ru: 'В названии лота указывайте важнейшие нюансы лота: название предмета, количество. Не забывайте о правилах сайта.',
  },
  sec_photo_video: { uk: 'Фото та відео лоту', en: 'Lot photos and video', pl: 'Zdjęcia i wideo lotu', ru: 'Фото и видео лота' },
  hint_video: {
    uk: 'Якщо у Вас є відео з оглядом цього лоту, будь ласка, вставте посилання на відеоролик. Важливо! Допускається тільки посилання на відеоролик, розміщений на YouTube.',
    en: 'If you have a video review of this lot, please paste the link. Important: only YouTube links are accepted.',
    pl: 'Jeśli masz wideo z prezentacją lotu, wklej link. Ważne: akceptowane są tylko linki do YouTube.',
    ru: 'Если у Вас есть видео с обзором этого лота, пожалуйста, вставьте ссылку на видеоролик. Важно! Допускается только ссылка на видеоролик, размещённый на YouTube.',
  },
  hint_photos: {
    uk: 'Не більше ніж 12 фото. Максимальний розмір фотографії — 8 мегабайт. Завантажити можна файли з розширенням .jpg, .jpeg, .png. Перше фото стане головним у лоті.',
    en: 'Up to 12 photos. Maximum photo size — 8 MB. Allowed extensions: .jpg, .jpeg, .png. The first photo becomes the lot cover.',
    pl: 'Maksymalnie 12 zdjęć. Maksymalny rozmiar zdjęcia — 8 MB. Dozwolone rozszerzenia: .jpg, .jpeg, .png. Pierwsze zdjęcie będzie okładką lotu.',
    ru: 'Не более 12 фото. Максимальный размер фотографии — 8 мегабайт. Загрузить можно файлы с расширением .jpg, .jpeg, .png. Первое фото станет главным в лоте.',
  },
  add_photo: { uk: '*Додати фото', en: '*Add photos', pl: '*Dodaj zdjęcia', ru: '*Добавить фото' },
  click_to_choose: { uk: 'Натисніть, щоб вибрати файли', en: 'Click to choose files', pl: 'Kliknij, aby wybrać pliki', ru: 'Нажмите, чтобы выбрать файлы' },
  photos_chosen: { uk: 'Обрано фото: {n}', en: 'Photos chosen: {n}', pl: 'Wybrano zdjęć: {n}', ru: 'Выбрано фото: {n}' },
  choose_continue: { uk: 'Виберіть, щоб продовжити', en: 'Choose to continue', pl: 'Wybierz, aby kontynuować', ru: 'Выберите, чтобы продолжить' },
  btn_to_auction: { uk: 'Виставити на торги', en: 'Put up for auction', pl: 'Wystaw na licytację', ru: 'Выставить на торги' },
  btn_fixed_price: { uk: 'Продати за фіксованою ціною', en: 'Sell at a fixed price', pl: 'Sprzedaj po stałej cenie', ru: 'Продать по фиксированной цене' },
  btn_vip_request: { uk: 'VIP — ціна за запитом', en: 'VIP — price on request', pl: 'VIP — cena na zapytanie', ru: 'VIP — цена по запросу' },
  sec_details: { uk: 'Опис предмета', en: 'Item description', pl: 'Opis przedmiotu', ru: 'Описание предмета' },
  sec_terms: { uk: 'Умови продажу', en: 'Sale terms', pl: 'Warunki sprzedaży', ru: 'Условия продажи' },
  field_buy_now: { uk: 'Бліц-ціна («Купити зараз»), ₴ — необов\'язково', en: 'Blitz price (Buy Now), ₴ — optional', pl: 'Cena blitz (Kup teraz), ₴ — opcjonalnie', ru: 'Блиц-цена («Купить сейчас»), ₴ — необязательно' },
};

/** Country → flag emoji for the profile card (codes from AUTH_COUNTRIES). */
const COUNTRY_FLAGS: Record<string, string> = {
  UA: '🇺🇦', PL: '🇵🇱', DE: '🇩🇪', CZ: '🇨🇿', GB: '🇬🇧', US: '🇺🇸', CA: '🇨🇦', OTHER: '🌍',
};

/** 14px stroke icons for the cabinet menu (Violity's menu shows one per item). */
const svg = (paths: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="15" height="15" aria-hidden="true">${paths}</svg>`;
const CAB_ICONS: Record<string, string> = {
  home: svg('<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>'),
  messages: svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  reviews: svg('<path d="M7 11v9H4v-9h3Zm0 0 4-7c1.5 0 2.5 1 2.5 2.5L13 10h6a2 2 0 0 1 2 2.4l-1.3 5.2A3 3 0 0 1 16.8 20H7"/>'),
  my_bids: svg('<path d="m13 4 7 7-3.5 3.5L9.5 7.5 13 4Z"/><path d="m11 9-7 7 3.5 3.5 7-7M3 21h9"/>'),
  won_lots: svg('<path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3"/>'),
  purchases: svg('<path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 10a3 3 0 0 0 6 0M9 7a3 3 0 0 1 6 0"/>'),
  favorites: svg('<path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z"/>'),
  collection: svg('<path d="M6 3h12l3 6-9 12L3 9l3-6Z"/><path d="M3 9h18M9 3l3 6 3-6M12 21 9 9M12 21l3-12"/>'),
  sellers: svg('<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M15.5 4.8a3.5 3.5 0 0 1 0 6.4M17 15.2c2.4.6 4 2.2 4 4.8"/>'),
  saved_searches: svg('<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>'),
  my_lots: svg('<path d="M3 7l9-4 9 4v10l-9 4-9-4V7Z"/><path d="M3 7l9 4 9-4M12 11v10"/>'),
  create: svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
  wallet: svg('<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M15 14.5h3"/>'),
  settings: svg('<circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"/>'),
  password: svg('<rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
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
  renderHomeTab(): string;
  cabCounts(): Record<string, number>;
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
  chooseSaleType(type: SaleType): void;
  clearCreateForm(): void;
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
      const chosen = editing?.saleType ?? null;

      // Violity-style «Додавання лоту»: sectioned cards; each row = field on the left,
      // explanatory hint box on the right.
      const card = (title: string, inner: string) => `
        <div class="lc-card">
          <div class="lc-card-title">${title}</div>
          ${inner}
        </div>`;
      const row = (field: string, hint: string) => `
        <div class="lc-row">
          <div class="lc-field">${field}</div>
          <div class="lc-hint">${hint}</div>
        </div>`;
      const dayLabel = (n: number) => `${n} ${this.currentLang === 'en' ? (n === 1 ? 'day' : 'days') : this.currentLang === 'pl' ? (n === 1 ? 'dzień' : 'dni') : (n === 1 ? 'день' : n < 5 ? 'дні' : 'днів')}`;

      body = `
        ${editing ? `<div class="cab-note">${this.t('label_editing_lot')} LOT-0${editing.id}</div>` : ''}
        <div class="lc-topbar">
          <span class="lc-required-note">${this.cabT('create_required_note')}</span>
          <button type="button" class="lc-clear" data-action="clear-create-form">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="13" height="13"><path d="m5 12 6-8h8l-6 8 6 8h-8l-6-8ZM3 20h8"/></svg>
            ${this.cabT('btn_clear_form')}
          </button>
        </div>

        ${card(this.cabT('sec_place_name'),
          row(`<label class="lc-label">* ${this.t('label_category')}</label>
               <select id="newCategory">
                 ${catOpts.map(([val, key]) => `<option value="${val}" ${editing?.category === val ? 'selected' : ''}>${this.t(key)}</option>`).join('')}
               </select>`, this.cabT('hint_category')) +
          row(`<label class="lc-label">* ${this.t('field_lot_name')}</label>
               <div class="lc-count-wrap">
                 <input id="newName" maxlength="90" value="${(etr?.name ?? '').replace(/"/g, '&quot;')}" data-counter="newNameCount">
                 <span class="lc-count mono" id="newNameCount">${90 - (etr?.name?.length ?? 0)}</span>
               </div>`, this.cabT('hint_name'))
        )}

        ${card(this.cabT('sec_photo_video'),
          row(`<label class="lc-label">${this.t('field_lot_video')}</label>
               <input id="newVideo" placeholder="https://youtube.com/watch?v=..." value="${editing?.videoUrl ?? ''}">`, this.cabT('hint_video')) +
          row(`<label class="lc-upload" for="newPhotos">
                 <input id="newPhotos" type="file" accept="image/png,image/jpeg" multiple class="lc-upload-input">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="26" height="26" aria-hidden="true"><path d="M12 16V7m0 0-3.5 3.5M12 7l3.5 3.5"/><path d="M4 16.5A4.5 4.5 0 0 0 6.5 20h11a4 4 0 0 0 .6-7.96A6.5 6.5 0 0 0 5.4 9.6 4.5 4.5 0 0 0 4 16.5Z"/></svg>
                 <span class="lc-upload-title">${this.cabT('add_photo')}</span>
                 <span class="lc-upload-sub" id="newPhotosLabel">${this.cabT('click_to_choose')}</span>
               </label>
               ${editing?.photo ? `<img src="${editing.photo}" alt="" class="lot-media-preview" style="margin-top:10px;">` : ''}`, this.cabT('hint_photos'))
        )}

        ${card(this.cabT('sec_details'), `
          <div class="lc-grid">
            <div class="field"><label>${this.t('field_lot_era')}</label><input id="newEra" placeholder="1900-1910" value="${etr?.era ?? ''}"></div>
            <div class="field"><label>${this.t('field_lot_icon')}</label><select id="newIcon">${iconOptions}</select></div>
            <div class="field"><label>${this.t('label_material')}</label><input id="newMaterial" value="${editing?.custom?.material ?? ''}"></div>
            <div class="field"><label>${this.t('label_condition')}</label><input id="newCondition" value="${editing?.custom?.condition ?? ''}"></div>
            <div class="field lc-span"><label>${this.t('field_lot_desc')}</label><input id="newDesc" value="${(etr?.desc ?? '').replace(/"/g, '&quot;')}"></div>
            <div class="field lc-span"><label>${this.t('field_lot_story')}</label><textarea id="newProvenance" rows="3" placeholder="${this.t('placeholder_lot_story')}" style="width:100%; background:var(--field-bg); border:1px solid var(--line); color:var(--ivory); border-radius:var(--radius); padding:11px 12px; font-family:'Karla',sans-serif; font-size:0.96875rem; resize:vertical;">${editing?.provenance?.uk ?? ''}</textarea></div>
          </div>
        `)}

        <div class="lc-card lc-choose-card">
          <div class="lc-card-title">${this.cabT('choose_continue')}</div>
          <div class="lc-choose">
            <button type="button" class="lc-choice lc-choice-auction ${chosen === 'auction' ? 'active' : ''}" data-action="choose-sale-type" data-sale="auction">
              ${CAB_ICONS.my_bids} ${this.cabT('btn_to_auction')}
            </button>
            <button type="button" class="lc-choice lc-choice-shop ${chosen === 'shop' ? 'active' : ''}" data-action="choose-sale-type" data-sale="shop">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="15" height="15" aria-hidden="true"><path d="M3 3h8l10 10-8 8L3 11V3Z"/><circle cx="8" cy="8" r="1.6"/></svg>
              ${this.cabT('btn_fixed_price')}
            </button>
          </div>
          <button type="button" class="lc-choice-vip ${chosen === 'request' ? 'active' : ''}" data-action="choose-sale-type" data-sale="request">${this.cabT('btn_vip_request')}</button>
          <select id="newSaleType" style="display:none;" data-action="sale-type-change" aria-hidden="true">
            <option value="shop" ${chosen === 'shop' ? 'selected' : ''}>${this.t('opt_sale_shop')}</option>
            <option value="auction" ${chosen === 'auction' || chosen === null ? 'selected' : ''}>${this.t('opt_sale_auction')}</option>
            <option value="request" ${chosen === 'request' ? 'selected' : ''}>${this.t('opt_sale_request')}</option>
          </select>
        </div>

        <div id="saleDetails" style="display:${chosen ? '' : 'none'};">
          ${card(this.cabT('sec_terms'), `
            <div class="lc-grid">
              <div class="field" id="priceField" style="display:${chosen === 'shop' ? '' : 'none'};"><label>* ${this.t('field_lot_price')}</label><input id="newPrice" type="number" min="0" value="${editing?.price ?? ''}" data-action="commission-input"></div>
              <div class="field" id="startPriceField" style="display:${chosen === 'auction' ? '' : 'none'};"><label>* ${this.t('field_start_price')}</label><input id="newStartPrice" type="number" min="0" value="${editing?.startPrice ?? ''}" data-action="commission-input"></div>
              <div class="field" id="durationField" style="display:${chosen === 'auction' ? '' : 'none'};"><label>${this.t('field_duration')}</label>
                <select id="newDuration">
                  <option value="1">${dayLabel(1)}</option>
                  <option value="3">${dayLabel(3)}</option>
                  <option value="7" selected>${dayLabel(7)}</option>
                </select>
              </div>
              <div class="field" id="buyNowField" style="display:${chosen === 'auction' ? '' : 'none'};"><label>${this.cabT('field_buy_now')}</label><input id="newBuyNow" type="number" min="0" value="${editing?.buyNowPrice ?? ''}"></div>
            </div>
            <div class="commission-box" id="commissionBox">${this.commissionBoxHtml(sellPrice)}</div>
          `)}
          <div style="display:flex; gap:10px; margin-top:4px;">
            ${editing ? `<button class="btn btn-ghost" style="flex:1; justify-content:center;" data-action="cancel-edit-listing">${this.t('btn_cancel')}</button>` : ''}
            <button class="btn btn-primary" style="flex:2; justify-content:center;" data-action="publish-listing">${editing ? this.t('btn_save_changes') : this.t('btn_publish')}</button>
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
    } else if (tab === 'home') {
      body = this.renderHomeTab();
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

  /** Real per-section counts shown next to the menu items (Violity shows them too). */
  cabCounts(this: App): Record<string, number> {
    const myBids = this.products.filter(p => p.saleType === 'auction' && p.bidHistory?.some(h => h.user === this.currentUser)).length;
    const won = this.products.filter(p =>
      p.saleType === 'auction' && p.endTime && new Date(p.endTime).getTime() <= Date.now() && p.bidHistory?.[0]?.user === this.currentUser
    ).length;
    return {
      messages: Object.values(this.lotChatMessages).filter(m => m.length > 0).length,
      reviews: 0,
      my_bids: myBids,
      won_lots: won,
      purchases: this.purchaseHistory.length,
      favorites: this.favorites.size,
      collection: this.products.filter(p => this.favorites.has(p.id) && (p.investmentRating || p.priceGrowthPct)).length,
      sellers: this.followedSellers.size,
      saved_searches: this.savedSearches.length,
      my_lots: this.products.filter(p => p.seller === this.currentUser).length,
    };
  },

  /** «Головна» — dashboard overview like Violity's profile home: summary cards with real
      counts, a few latest rows each, honest empty states, and view-all links into the tabs. */
  renderHomeTab(this: App): string {
    const counts = this.cabCounts();
    const card = (id: string, title: string, count: number | null, inner: string, full = false) => `
      <div class="cab-dash-card ${full ? 'full' : ''}">
        <div class="cab-dash-head">
          <span class="cab-dash-icon">${CAB_ICONS[id] ?? ''}</span>
          <span class="cab-dash-title">${title}</span>
          ${count !== null ? `<span class="cab-dash-count mono">${count}</span>` : ''}
          <button class="cab-dash-all" data-action="cabinet-tab" data-tab="${id}">${this.cabT('dash_view_all')} →</button>
        </div>
        <div class="cab-dash-body">${inner}</div>
      </div>`;
    const empty = (text: string) => `<div class="cab-dash-empty">${text}</div>`;
    const lotRow = (p: Product, right: string) => {
      const tr = this.getProductText(p);
      return `
        <div class="cab-dash-row" data-action="open-detail" data-id="${p.id}">
          <span>${tr.name} <span class="mono" style="color:var(--sage);">· LOT-0${p.id}</span></span>
          <span class="mono" style="color:var(--brass-light); flex-shrink:0;">${right}</span>
        </div>`;
    };

    const bidLots = this.products
      .filter(p => p.saleType === 'auction' && p.bidHistory?.some(h => h.user === this.currentUser))
      .slice(0, 3);
    const bidsInner = bidLots.length
      ? bidLots.map(p => lotRow(p, `${(p.currentBid ?? 0).toLocaleString('uk-UA')} ₴`)).join('')
      : empty(this.t('empty_my_bids'));

    const reviewsInner = empty(this.cabT('dash_no_reviews'));

    const myLots = this.products.filter(p => p.seller === this.currentUser).slice(0, 3);
    const lotsInner = myLots.length
      ? myLots.map(p => lotRow(p, `${(p.saleType === 'auction' ? (p.currentBid ?? p.startPrice ?? 0) : (p.price ?? 0)).toLocaleString('uk-UA')} ₴`)).join('')
      : empty(this.cabT('dash_no_lots'));

    const favs = this.products.filter(p => this.favorites.has(p.id)).slice(0, 3);
    const favsInner = favs.length
      ? favs.map(p => lotRow(p, `${(p.saleType === 'auction' ? (p.currentBid ?? p.startPrice ?? 0) : (p.price ?? 0)).toLocaleString('uk-UA')} ₴`)).join('')
      : empty(this.cabT('dash_no_favorites'));

    return `
      <div class="cab-dash-grid">
        ${card('my_bids', this.t('tab_my_bids'), counts.my_bids, bidsInner)}
        ${card('reviews', this.cabT('dash_reviews_title'), null, reviewsInner)}
        ${card('my_lots', this.cabT('dash_active_lots'), counts.my_lots, lotsInner, true)}
        ${card('favorites', this.t('tab_my_favorites'), counts.favorites, favsInner, true)}
      </div>`;
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
    const allTabs = ['home', 'messages', 'reviews', 'my_bids', 'won_lots', 'purchases', 'favorites', 'collection',
      'sellers', 'saved_searches', 'my_lots', 'create', 'wallet', 'settings', 'password'];
    if (!allTabs.includes(tab)) tab = 'home';
    try { history.replaceState(null, '', `/cabinet?tab=${tab}`); } catch { /* ignore */ }

    const stored = findUser(this.currentUser);
    const regDate = new Date(stored?.regDate ?? Date.now()).toLocaleDateString('uk-UA');
    const counts = this.cabCounts();
    const countryLabel = stored?.country ? (AUTH_COUNTRIES.find(c => c.code === stored.country)?.label[this.currentLang] ?? '') : '';
    const flag = stored?.country ? (COUNTRY_FLAGS[stored.country] ?? '') : '';

    const item = (id: string, label: string) => {
      const n = counts[id];
      return `
        <button class="cab-menu-item ${tab === id ? 'active' : ''}" data-action="cabinet-tab" data-tab="${id}">
          <span class="cab-menu-ic">${CAB_ICONS[id] ?? ''}</span>
          <span class="cab-menu-label">${label}</span>
          ${typeof n === 'number' ? `<span class="cab-menu-count mono">${n}</span>` : ''}
        </button>`;
    };
    const group = (label: string, items: string) =>
      `<div class="cab-menu-group"><div class="cab-menu-heading">${label}</div>${items}</div>`;

    const titles: Record<string, string> = {
      home: this.cabT('menu_home'),
      messages: this.cabT('menu_messages'), reviews: this.cabT('menu_reviews'),
      my_bids: this.t('tab_my_bids'), won_lots: this.t('tab_won_lots'), purchases: this.t('tab_purchases'),
      favorites: this.t('tab_my_favorites'), collection: this.t('tab_my_collection'), sellers: this.t('tab_my_sellers'),
      saved_searches: this.t('tab_saved_searches'), my_lots: this.t('tab_my_lots'), create: this.t('tab_create'),
      wallet: this.t('tab_wallet'), settings: this.cabT('menu_settings'), password: this.cabT('menu_password'),
    };

    root.innerHTML = `
      <div class="cab-layout">
        <aside class="cab-side-col">
          <div class="cab-profile-card">
            <div class="cab-avatar-stamp"><div class="cab-avatar">${this.currentUser.slice(0, 2).toUpperCase()}</div></div>
            <div class="cab-nick">${this.currentUser}</div>
            ${stored?.fullName ? `<div class="cab-fullname">${stored.fullName}</div>` : ''}
            ${countryLabel ? `<div class="cab-country">${flag} ${countryLabel}</div>` : ''}
            <div class="cab-rating" title="${this.cabT('rating_hint')}">
              <span class="cab-rating-label">${this.cabT('rating_label')}</span>
              <span class="mono">0.00</span><span class="cab-rating-sep">|</span><span class="mono">0.00</span>
            </div>
            <div class="cab-meta">${this.cabT('member_since')} ${regDate}</div>
            <button class="cab-balance" data-action="cabinet-tab" data-tab="wallet">
              <span>${this.t('wallet_balance')}</span>
              <span class="mono">${this.walletBalance.toLocaleString('uk-UA')} ₴</span>
            </button>
          </div>
          <nav class="cab-sidebar cab-menu">
            ${item('home', this.cabT('menu_home'))}
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
        <section class="cab-content ${tab === 'home' ? 'cab-content-dash' : ''}">
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
    const buyNow = document.getElementById('buyNowField');
    if (buyNow) buyNow.style.display = val === 'auction' ? '' : 'none';
    this.updateCommissionBox();
  },

  /** «Виберіть, щоб продовжити» — the big auction / fixed-price / VIP buttons: records the
      choice in the hidden #newSaleType select and reveals the sale-terms section. */
  chooseSaleType(this: App, type: SaleType): void {
    const sel = document.getElementById('newSaleType') as HTMLSelectElement | null;
    if (!sel) return;
    sel.value = type;
    document.querySelectorAll('.lc-choice, .lc-choice-vip').forEach(b => {
      b.classList.toggle('active', (b as HTMLElement).dataset.sale === type);
    });
    const details = document.getElementById('saleDetails');
    if (details) {
      details.style.display = '';
      details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    this.handleSaleTypeChange();
  },

  clearCreateForm(this: App): void {
    this.editingLotId = null;
    this.openCabinet('create');
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
    // Single Violity-style upload area: first file becomes the lot cover, the rest go to extraPhotos.
    const photosInput = $<HTMLInputElement>('newPhotos');

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
        const buyNowNum = parseInt(($<HTMLInputElement>('newBuyNow').value || '').trim(), 10);
        if (!isNaN(buyNowNum) && buyNowNum > startNum) product.buyNowPrice = buyNowNum;
        else delete product.buyNowPrice;
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

    const files = photosInput.files ? Array.from(photosInput.files).slice(0, 12) : [];
    const file = files[0] ?? null;
    const extraFiles = files.slice(1);

    Promise.all([
      file ? readAsDataUrl(file) : Promise.resolve(null),
      extraFiles.length ? Promise.all(extraFiles.map(readAsDataUrl)) : Promise.resolve(null),
    ]).then(([photoData, extraPhotosData]) => finish(photoData, extraPhotosData));
  },
};
