import type {
  Lang, Theme, CatalogFilter, SortMode, Product, CartItem, PurchaseRecord, ProductText, IconKey,
  SaleType, DashboardRole, Category, Rarity, Badge, SavedSearch
} from '../types';
import { UI } from '../data/i18n';
import { PAGE_TEXTS, PAGE_TITLES } from '../data/pages-i18n';
import {
  SEEDED_PRODUCTS, PRODUCT_I18N, MATERIAL_BY_ICON, CONDITION_BY_CAT, ICON_LABELS, ICON_PATHS, NEXT_LOT_ID, SELLERS
} from '../data/products';
import { catalogMethods } from './catalog';
import { cartMethods } from './cart';
import { lotDetailMethods } from './lot-detail';
import { cabinetMethods } from './cabinet';

type CatalogMode = 'all' | 'shop' | 'auction';

import { $ } from './dom-utils';


const MOON_ICON = '<path d="M21 12.4A9 9 0 1 1 11.6 3a7 7 0 0 0 9.4 9.4Z"/>';
const SUN_ICON = '<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8"/>';

export class VintageHallApp {
  products: Product[] = SEEDED_PRODUCTS.map(p => ({ ...p, bidHistory: p.bidHistory ? [...p.bidHistory] : undefined }));
  cart: CartItem[] = [];
  favorites = new Set<number>();
  compareSet = new Set<number>();
  readonly maxCompare = 4;
  /** Sellers the current user follows (#"подписчики продавца" feedback) — persisted to localStorage. */
  followedSellers = new Set<string>();
  /** Saved search queries the user wants to revisit / be "notified" about — persisted to localStorage. */
  savedSearches: SavedSearch[] = [];
  /** Tracks which lot's detail modal is currently open, if any — lets actions taken inside it
      (like following the seller) re-render the same modal in place. */
  currentLotDetailId: number | null = null;
  purchaseHistory: PurchaseRecord[] = [];

  activeCat: CatalogFilter = 'all';
  catalogMode: CatalogMode = 'all';
  currentLang: Lang = 'uk';
  currentTheme: Theme = 'dark';
  searchQuery = '';
  originFilter = '';
  rarityFilter = '';
  materialFilter = '';
  sortMode: SortMode = 'default';
  currentUser: string | null = null;
  nextLotId = NEXT_LOT_ID;
  dashboardRole: DashboardRole = 'buyer';
  walletBalance = 5000;

  // ---------- photo lightbox state ----------
  lightboxPhotos: string[] = [];
  lightboxIndex = 0;
  lightboxThumbsId: number | null = null;
  editingLotId: number | null = null;
  readonly platformFeePct = 8;

  t(key: keyof typeof UI['uk']): string {
    return UI[this.currentLang][key];
  }

  getProductText(p: Product | CartItem): ProductText {
    if (p.custom) return { name: p.custom.name, era: p.custom.era, desc: p.custom.desc };
    return PRODUCT_I18N[p.id][this.currentLang];
  }

  watcherCount(id: number): number {
    return (id * 17 + 9) % 23 + 6;
  }

  // ---------- theme ----------

  applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    $('themeIcon').innerHTML = this.currentTheme === 'dark' ? MOON_ICON : SUN_ICON;
  }

  // ---------- static text ----------

  applyStaticTexts(): void {
    document.documentElement.lang = this.currentLang;
    const set = (id: string, text: string) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    const setHTML = (id: string, html: string) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

    set('topbarTagline', this.t('tagline'));
    set('navCatalog', this.t('nav_catalog'));
    set('navNews', this.t('nav_news'));
    set('navForum', this.t('nav_forum'));
    set('navAbout', this.t('nav_about'));
    set('navContacts', this.t('nav_contacts'));
    set('cartBtnLabel', this.t('cart_btn'));
    set('accountBtnLabel', this.t('nav_account'));
    set('addLotBtnLabel', this.t('add_lot_btn'));
    set('heroEyebrow', this.t('hero_eyebrow'));
    setHTML('heroH1', this.t('hero_h1_new'));
    set('heroP', this.t('hero_sub_new'));
    set('btnViewAuctions', this.t('btn_view_auctions'));
    set('heroSellBtn', this.t('btn_sell_item'));
    set('collectionsTitle', this.t('collections_title'));
    set('collectionsSub', this.t('collections_sub'));
    set('collectionPorcelain', this.t('collection_porcelain'));
    set('collectionMilitaria', this.t('collection_militaria'));
    set('collectionNumismatics', this.t('collection_numismatics'));
    set('collectionPainting', this.t('collection_painting'));
    set('collectionClocks', this.t('collection_clocks'));
    set('collectionJewelry', this.t('collection_jewelry'));
    setHTML('heroStamp', this.t('hero_stamp'));
    set('heroLotLabel', this.t('total_lots'));
    set('catalogTitle', this.t('catalog_title'));
    set('catalogPageTitle', this.t('catalog_title'));
    set('catalogPageSub', this.t('catalog_page_sub'));
    set('aboutQuote', this.t('about_quote'));
    setHTML('aboutP1', this.t('about_p1'));
    set('aboutP2', this.t('about_p2'));
    set('footerCopyright', this.t('footer_copyright'));
    set('footerRules', this.t('footer_rules'));
    set('footerDelivery', this.t('footer_delivery'));
    set('cartTitle', this.t('cart_title'));
    set('sidebarTitle', this.t('sidebar_categories'));
    set('trustRatingLabel', this.t('trust_rating'));
    set('trustDealsLabel', this.t('trust_deals'));
    set('trustSellersBuyersLabel', this.t('trust_sellers_buyers'));
    set('trustVolumeLabel', this.t('trust_volume'));
    set('trustOnlineLabel', this.t('trust_online'));
    set('whyBuyTitle', this.t('why_buy_title'));
    set('whyVerified', this.t('why_verified_sellers'));
    set('whyExpertise', this.t('why_expertise'));
    set('whySafeDeal', this.t('why_safe_deal'));
    set('whyReturn', this.t('why_return_guarantee'));
    set('whyDeliveryUa', this.t('why_delivery_ua'));
    set('whyIntlDelivery', this.t('why_intl_delivery'));
    set('safetyTitle', this.t('safety_title'));
    set('safetyStep1', this.t('safety_step1'));
    set('safetyStep2', this.t('safety_step2'));
    set('safetyStep3', this.t('safety_step3'));
    set('safetyStep4', this.t('safety_step4'));
    set('chatTitle', this.t('chat_title'));
    set('chatWelcome', this.t('chat_welcome'));
    document.getElementById('chatCloseBtn')?.setAttribute('aria-label', this.t('chat_close_label'));
    document.getElementById('chatInput')?.setAttribute('placeholder', this.t('chat_input_placeholder'));
    document.getElementById('chatInput')?.setAttribute('aria-label', this.t('chat_input_aria'));
    document.getElementById('chatSendBtn')?.setAttribute('aria-label', this.t('chat_send_aria'));

    const raritySel = document.getElementById('filterRarity') as HTMLSelectElement | null;
    if (raritySel) {
      raritySel.options[0].textContent = `— ${this.t('filter_rarity')} (${this.t('filter_any')}) —`;
      raritySel.options[1].textContent = this.t('rarity_common');
      raritySel.options[2].textContent = this.t('rarity_rare');
      raritySel.options[3].textContent = this.t('rarity_unique');
    }
    this.populateFilters();
    set('modeAllLabel', this.t('tab_all'));
    set('modeShopLabel', this.t('mode_shop'));
    set('modeAuctionLabel', this.t('mode_auction'));
    document.getElementById('searchInput')?.setAttribute('placeholder', this.t('search_ph'));
    document.getElementById('saveSearchBtn')?.setAttribute('aria-label', this.t('btn_save_search'));
    document.getElementById('saveSearchBtn')?.setAttribute('title', this.t('btn_save_search'));
    const hdrSearchPh = PAGE_TEXTS['hdr.search_ph'];
    if (hdrSearchPh) {
      const ph = hdrSearchPh[this.currentLang] ?? hdrSearchPh.uk;
      document.getElementById('headerSearchInput')?.setAttribute('placeholder', ph);
      document.getElementById('headerSearchInput')?.setAttribute('aria-label', ph);
    }

    document.querySelectorAll<HTMLButtonElement>('#sidebarTabs .tab').forEach(tab => {
      const key = tab.dataset.key as keyof typeof UI['uk'] | undefined;
      if (key) tab.textContent = this.t(key);
    });

    const sortSel = document.getElementById('sortSelect') as HTMLSelectElement | null;
    if (sortSel) {
      sortSel.options[0].textContent = this.t('sort_default');
      sortSel.options[1].textContent = this.t('sort_price_asc');
      sortSel.options[2].textContent = this.t('sort_price_desc');
      sortSel.options[3].textContent = this.t('sort_new');
      sortSel.options[4].textContent = this.t('sort_ending_soon');
    }

    // Static content pages + footer opt in with data-i18n="key" (see data/pages-i18n.ts).
    // Keys carrying markup are marked with data-i18n-html and applied via innerHTML.
    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
      const entry = PAGE_TEXTS[el.dataset.i18n ?? ''];
      if (!entry) return;
      const value = entry[this.currentLang] ?? entry.uk;
      if (el.dataset.i18nHtml !== undefined) el.innerHTML = value;
      else el.textContent = value;
    });
    const pageTitle = PAGE_TITLES[location.pathname.replace(/\/+$/, '') || '/'];
    if (pageTitle) document.title = pageTitle[this.currentLang] ?? pageTitle.uk;
  }

  // ---------- small label helpers (kept out of the UI dict since they're 4-way ternaries already) ----------

  addToCartLabel(): string {
    const map: Record<Lang, string> = { en: 'Add to cart', pl: 'Do koszyka', ru: 'В корзину', uk: 'У кошик' };
    return map[this.currentLang];
  }

  priceOnRequestLabel(): string {
    const map: Record<Lang, string> = { en: 'Price on request', pl: 'Cena na zapytanie', ru: 'Цена по запросу', uk: 'Ціна за запитом' };
    return map[this.currentLang];
  }

  nothingFoundLabel(): string {
    const map: Record<Lang, string> = { en: 'Nothing found.', pl: 'Nic nie znaleziono.', ru: 'Ничего не найдено.', uk: 'Нічого не знайдено.' };
    return map[this.currentLang];
  }

  // ---------- catalog ----------




  /** Restores catalog filters from the URL (?category=&origin=&material=&rarity=&mode=&q=&sort=)
      so a filtered/searched view can be bookmarked or shared, per the dev-review feedback. */





  /** Maps rarity (+ museum badge as the top tier) to a 4-level colour-coded indicator, per the
      "🟢 Common / 🟡 Rare / 🟠 Very rare / 🔴 Museum-grade" feedback. */




  /** Updates every visible auction countdown once per second; stops itself once nothing's left to tick. */
  timerInterval: number | undefined;



  // ---------- compare lots (#"сравнение товаров" from buyer-side feedback) ----------






  // ---------- bidding ----------


  // ---------- cart ----------







  // ---------- modal: checkout ----------






  // ---------- lot detail ----------



  // ---------- photo lightbox ----------








  // ---------- VIP request ----------




  // ---------- footer info ----------


  // ---------- cabinet / account ----------













  /** "Мої продавці" cabinet tab (#14 / #4) — a lightweight seller directory with trust signals,
      since the project intentionally doesn't have full standalone seller-profile pages. */



  /** Commission calculator shown in the create/edit lot form (#monetization from the dev review) —
      makes the platform fee and net payout explicit before the seller publishes. */







  // ---------- toast notifications ----------

  showToast(message: string): void {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    // Cap concurrent toasts so rapid-fire notifications (e.g. repeated zoom clicks) don't pile up endlessly.
    while (container.children.length >= 3) container.firstElementChild?.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3100);
  }

  // ---------- support chat ----------


  // ---------- lot chat (buyer-seller in detail modal) ----------

  lotChatMessages: Record<number, Array<{user: string; text: string}>> = {};



  // ---------- accessibility toolbar ----------

  /** 1x (no zoom) plus 13 steps up to 15x — fine-grained at first, larger jumps near the top,
      matching how screen-magnifier tools for low vision progress. */
  private readonly zoomSteps = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15];
  private zoomIndex = 0;
  private highContrast = false;

  private applyZoom(): void {
    const scale = this.zoomSteps[this.zoomIndex];
    // Primary mechanism: CSS `zoom` scales the ENTIRE page — text, images, spacing,
    // even fixed-position elements — exactly like the browser's own Ctrl+ page zoom.
    document.documentElement.style.zoom = String(scale);
    // Fallback for browsers without `zoom` support (e.g. Firefox): grow root font-size,
    // which scales all text (every size in this stylesheet is in rem) even if layout stays put.
    if (this.zoomIndex === 0) document.documentElement.removeAttribute('data-zoom-level');
    else document.documentElement.setAttribute('data-zoom-level', String(this.zoomIndex));

    const zoomIn = document.getElementById('a11yZoomIn') as HTMLButtonElement | null;
    const zoomOut = document.getElementById('a11yZoomOut') as HTMLButtonElement | null;
    if (zoomIn) zoomIn.disabled = this.zoomIndex >= this.zoomSteps.length - 1;
    if (zoomOut) zoomOut.disabled = this.zoomIndex <= 0;
  }

  initA11y(): void {
    const zoomIn = document.getElementById('a11yZoomIn');
    const zoomOut = document.getElementById('a11yZoomOut');
    const contrast = document.getElementById('a11yContrast');
    if (!zoomIn || !zoomOut || !contrast) return;

    const zoomedLabel = (pct: number) =>
      this.currentLang === 'en' ? `Page zoomed to ${pct}%`
      : this.currentLang === 'pl' ? `Powiększono stronę do ${pct}%`
      : this.currentLang === 'ru' ? `Страница увеличена до ${pct}%`
      : `Сторінку збільшено до ${pct}%`;

    zoomIn.addEventListener('click', () => {
      if (this.zoomIndex >= this.zoomSteps.length - 1) return;
      this.zoomIndex++;
      this.applyZoom();
      this.showToast(zoomedLabel(Math.round(this.zoomSteps[this.zoomIndex] * 100)));
    });

    zoomOut.addEventListener('click', () => {
      if (this.zoomIndex <= 0) return;
      this.zoomIndex--;
      this.applyZoom();
      this.showToast(zoomedLabel(Math.round(this.zoomSteps[this.zoomIndex] * 100)));
    });

    const savedContrast = localStorage.getItem('vh_contrast');
    if (savedContrast === 'high') {
      this.highContrast = true;
      document.documentElement.setAttribute('data-contrast', 'high');
      contrast.classList.add('active');
    }

    contrast.addEventListener('click', () => {
      this.highContrast = !this.highContrast;
      if (this.highContrast) {
        document.documentElement.setAttribute('data-contrast', 'high');
        contrast.classList.add('active');
        try { localStorage.setItem('vh_contrast', 'high'); } catch {}
      } else {
        document.documentElement.removeAttribute('data-contrast');
        contrast.classList.remove('active');
        try { localStorage.removeItem('vh_contrast'); } catch {}
      }
    });

    this.applyZoom();
  }

  // ---------- mobile/desktop view toggle ----------

  /** Closes the "Карта сайта" side panel (Header.astro) after a link/lang click or cabinet open.
      Visibility is driven entirely by the .open class (not Tailwind's responsive hidden/flex
      utilities), so the panel can't get left stuck open by a breakpoint mismatch. */
  closeSitemap(): void {
    document.getElementById('sitemapPanel')?.classList.remove('open');
    document.getElementById('sitemapOverlay')?.classList.remove('open');
    document.getElementById('sitemapBtn')?.setAttribute('aria-expanded', 'false');
  }

  initViewToggle(): void {
    const mobileBtn = document.getElementById('viewMobileBtn');
    const desktopBtn = document.getElementById('viewDesktopBtn');
    if (!mobileBtn || !desktopBtn) return;

    desktopBtn.addEventListener('click', () => {
      document.documentElement.setAttribute('data-force-desktop', 'true');
      const vp = document.querySelector('meta[name="viewport"]');
      if (vp) vp.setAttribute('content', 'width=1200');
      desktopBtn.classList.add('active');
      mobileBtn.classList.remove('active');
    });

    mobileBtn.addEventListener('click', () => {
      document.documentElement.removeAttribute('data-force-desktop');
      const vp = document.querySelector('meta[name="viewport"]');
      if (vp) vp.setAttribute('content', 'width=device-width, initial-scale=1.0');
      mobileBtn.classList.add('active');
      desktopBtn.classList.remove('active');
    });
  }

  // ---------- bootstrap ----------

  init(): void {
    // Captured before renderCatalog() below — it rewrites the URL via history.replaceState
    // (syncFiltersToUrl) and would strip ?lot= before this could be read otherwise.
    const lotParam = new URLSearchParams(window.location.search).get('lot');

    this.loadPreferences();
    this.applyTheme();
    this.applyStaticTexts();
    this.syncLangSwitchButtons();
    this.loadFiltersFromUrl();
    this.populateFilters();
    this.renderActivityStrip();
    this.renderRecentSalesFeed();
    this.renderLiveAuctions();
    this.renderCatalog();
    this.renderCart();
    this.renderCompareBar();
    this.bindEvents();
    this.initScrollTop();
    this.initChat();
    this.initA11y();
    this.initViewToggle();
    this.initPhotoMagnifier();
    this.initLightboxKeys();
    document.getElementById('photoLightbox')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeLightbox();
    });

    // Deep link from the static SEO page at /lot/[id] (?lot=ID) — opens the full interactive lot card.
    if (lotParam) {
      const lotId = parseInt(lotParam, 10);
      if (this.products.some(p => p.id === lotId)) {
        setTimeout(() => this.openLotDetail(lotId), 100);
      }
    }
  }

  /** Reads theme/language/login/cart saved on a previous page so it carries over across navigation. */
  private loadPreferences(): void {
    try {
      const savedTheme = localStorage.getItem('vh_theme');
      const savedLang = localStorage.getItem('vh_lang');
      const savedUser = localStorage.getItem('vh_user');
      const savedRole = localStorage.getItem('vh_role');
      const savedCart = localStorage.getItem('vh_cart');
      const savedFollowed = localStorage.getItem('vh_followed_sellers');
      const savedSearches = localStorage.getItem('vh_saved_searches');
      if (savedTheme === 'dark' || savedTheme === 'light') this.currentTheme = savedTheme;
      if (savedLang === 'uk' || savedLang === 'en' || savedLang === 'pl' || savedLang === 'ru') this.currentLang = savedLang;
      if (savedUser) this.currentUser = savedUser;
      if (savedRole === 'buyer' || savedRole === 'seller') this.dashboardRole = savedRole;
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as CartItem[];
        // Only keep cart rows whose product still exists in this session's catalog (seeded items always do)
        this.cart = parsed.filter(c => this.products.some(p => p.id === c.id) || c.custom);
      }
      if (savedFollowed) {
        this.followedSellers = new Set(JSON.parse(savedFollowed) as string[]);
      }
      if (savedSearches) {
        this.savedSearches = JSON.parse(savedSearches) as SavedSearch[];
      }
    } catch {
      // localStorage unavailable (e.g. private browsing) — fall back to defaults silently
    }
  }

  savePreference(key: 'vh_theme' | 'vh_lang' | 'vh_user' | 'vh_role', value: string): void {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  }

  saveCart(): void {
    try { localStorage.setItem('vh_cart', JSON.stringify(this.cart)); } catch { /* ignore */ }
  }

  clearSavedUser(): void {
    try { localStorage.removeItem('vh_user'); } catch { /* ignore */ }
  }

  /** Highlights the correct active language button on load, since the saved language may differ from the markup default. */
  private syncLangSwitchButtons(): void {
    document.querySelectorAll<HTMLButtonElement>('#langSwitch button').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === this.currentLang);
    });
  }

  /** Renders the horizontal scrolling live auctions strip above the main catalog. */
  /** "Today on the marketplace" strip (#9) — gives the homepage a sense of a living marketplace
      rather than a static catalog, using real counts where possible and a believable highlight sale. */


  /** Shows/hides the scroll-to-top button based on scroll position. */
  initScrollTop(): void {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private bindEvents(): void {
    $('themeToggle').addEventListener('click', () => {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme();
      this.savePreference('vh_theme', this.currentTheme);
    });

    $('langSwitch').addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
      if (!btn || !btn.dataset.lang) return;
      this.currentLang = btn.dataset.lang as Lang;
      document.querySelectorAll('#langSwitch button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.applyStaticTexts();
      this.populateFilters();
      this.renderActivityStrip();
      this.renderRecentSalesFeed();
      this.renderLiveAuctions();
      this.renderCatalog();
      this.renderCart();
      this.savePreference('vh_lang', this.currentLang);
      document.dispatchEvent(new CustomEvent('vh-lang-changed', { detail: this.currentLang }));
    });

    document.getElementById('sidebarTabs')?.addEventListener('click', (e) => {
      const tab = (e.target as HTMLElement).closest<HTMLButtonElement>('.tab');
      if (!tab || !tab.dataset.cat) return;
      document.querySelectorAll('#sidebarTabs .tab').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
      this.activeCat = tab.dataset.cat as CatalogFilter;
      this.renderCatalog();
    });

    document.getElementById('modeToggle')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
      if (!btn || !btn.dataset.mode) return;
      document.querySelectorAll('#modeToggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.catalogMode = btn.dataset.mode as CatalogMode;
      this.renderCatalog();
    });

    document.getElementById('searchInput')?.addEventListener('input', (e) => {
      this.searchQuery = (e.target as HTMLInputElement).value.trim();
      this.renderCatalog();
    });

    document.getElementById('sortSelect')?.addEventListener('change', (e) => {
      this.sortMode = (e.target as HTMLSelectElement).value as SortMode;
      this.renderCatalog();
    });

    const markActiveFilter = (sel: HTMLSelectElement) =>
      sel.classList.toggle('active-filter', sel.value !== '');

    document.getElementById('filterOrigin')?.addEventListener('change', (e) => {
      const sel = e.target as HTMLSelectElement;
      this.originFilter = sel.value;
      markActiveFilter(sel);
      this.renderCatalog();
    });

    document.getElementById('filterRarity')?.addEventListener('change', (e) => {
      const sel = e.target as HTMLSelectElement;
      this.rarityFilter = sel.value;
      markActiveFilter(sel);
      this.renderCatalog();
    });

    document.getElementById('filterMaterial')?.addEventListener('change', (e) => {
      const sel = e.target as HTMLSelectElement;
      this.materialFilter = sel.value;
      markActiveFilter(sel);
      this.renderCatalog();
    });

    $('cartOpenBtn').addEventListener('click', () => this.openDrawer());
    $('cartCloseBtn').addEventListener('click', () => this.closeDrawer());
    $('overlay').addEventListener('click', () => { this.closeDrawer(); this.closeCheckout(); });

    $('accountBtn').addEventListener('click', () => {
      this.currentUser ? this.openCabinet(this.dashboardRole === 'seller' ? 'my_lots' : 'my_bids') : this.openLogin('my_bids');
    });
    document.getElementById('accountBtnMobile')?.addEventListener('click', () => {
      this.closeSitemap();
      this.currentUser ? this.openCabinet(this.dashboardRole === 'seller' ? 'my_lots' : 'my_bids') : this.openLogin('my_bids');
    });

    // "Карта сайта" panel — opens only on explicit click, at every breakpoint, and is closed by
    // toggling a single .open class on the panel + overlay (see closeSitemap above).
    const sitemapBtn = document.getElementById('sitemapBtn');
    const sitemapPanel = document.getElementById('sitemapPanel');
    const sitemapOverlay = document.getElementById('sitemapOverlay');
    sitemapBtn?.addEventListener('click', () => {
      const isOpen = sitemapPanel?.classList.toggle('open');
      sitemapOverlay?.classList.toggle('open', !!isOpen);
      sitemapBtn.setAttribute('aria-expanded', String(!!isOpen));
    });
    document.getElementById('sitemapCloseBtn')?.addEventListener('click', () => this.closeSitemap());
    sitemapOverlay?.addEventListener('click', () => this.closeSitemap());
    sitemapPanel?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => this.closeSitemap()));
    document.getElementById('langSwitchMobile')?.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
      if (!btn?.dataset.lang) return;
      $<HTMLButtonElement>('langSwitch').querySelector<HTMLButtonElement>(`[data-lang="${btn.dataset.lang}"]`)?.click();
      this.closeSitemap();
    });

    // Global header search — always routes to the dedicated /catalog page with a ?q= param, so a
    // search started from any page (home, news, about…) lands on a real, bookmarkable results view.
    // Custom file inputs (cabinet.ts create-lot form) — native <input type="file"> can't be styled
    // cross-browser, so the visible filename text is kept in sync here instead.
    document.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      if (input?.type !== 'file' || !input.classList.contains('file-input-native')) return;
      const nameEl = input.closest('.file-input-wrap')?.querySelector<HTMLElement>('.file-input-name');
      if (!nameEl) return;
      const emptyLabel = input.dataset.emptyLabel ?? this.t('label_no_file_chosen');
      if (!input.files || input.files.length === 0) {
        nameEl.textContent = emptyLabel;
      } else if (input.files.length === 1) {
        nameEl.textContent = input.files[0].name;
      } else {
        nameEl.textContent = this.t('label_files_chosen').replace('{n}', String(input.files.length));
      }
    });

    document.getElementById('headerSearchForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = $<HTMLInputElement>('headerSearchInput').value.trim();
      window.location.href = val ? `/catalog?q=${encodeURIComponent(val)}` : '/catalog';
    });
    document.getElementById('addLotBtn')?.addEventListener('click', () => {
      this.dashboardRole = 'seller';
      this.savePreference('vh_role', 'seller');
      this.editingLotId = null;
      if (this.currentUser) this.openCabinet('create');
      else this.openLogin('create');
    });
    document.getElementById('heroSellBtn')?.addEventListener('click', () => {
      this.dashboardRole = 'seller';
      this.savePreference('vh_role', 'seller');
      this.editingLotId = null;
      if (this.currentUser) this.openCabinet('create');
      else this.openLogin('create');
    });

    // Footer rules/delivery now link to standalone pages — no JS handler needed

    document.body.addEventListener('change', (e) => {
      const target = e.target as HTMLElement;
      if (target.dataset.action === 'sale-type-change') this.handleSaleTypeChange();
    });

    document.body.addEventListener('input', (e) => {
      const target = e.target as HTMLElement;
      if (target.dataset.action === 'commission-input') this.updateCommissionBox();
    });

    // Delegated handler for all dynamically rendered buttons (catalog cards, cart rows, modal content).
    document.body.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
      if (!target) return;
      const action = target.dataset.action;
      const id = target.dataset.id ? parseInt(target.dataset.id, 10) : undefined;

      switch (action) {
        case 'open-detail': this.openLotDetail(id!); break;
        case 'toggle-favorite': e.stopPropagation(); this.toggleFavorite(id!); break;
        case 'toggle-compare': e.stopPropagation(); this.toggleCompare(id!); break;
        case 'open-compare': this.openCompareModal(); break;
        case 'clear-compare': this.clearCompare(); break;
        case 'close-checkout-compare': this.closeCompareModal(); break;
        case 'toggle-follow-seller': e.stopPropagation(); this.toggleFollowSeller(target.dataset.seller ?? ''); break;
        case 'goto-category': this.goToCategory(target.dataset.cat as CatalogFilter); break;
        case 'add-to-cart': e.stopPropagation(); this.addToCart(id!); break;
        case 'vip-request': e.stopPropagation(); this.openVipRequest(id!); break;
        case 'place-bid': e.stopPropagation(); this.placeBid(id!); break;
        case 'buy-now': e.stopPropagation(); this.buyNowAuction(id!); break;
        case 'save-search': this.saveCurrentSearch(); break;
        case 'apply-saved-search': this.applySavedSearch(target.dataset.searchId ?? ''); break;
        case 'remove-saved-search': e.stopPropagation(); this.removeSavedSearch(target.dataset.searchId ?? ''); break;
        case 'set-autobid': this.setAutobid(id!); break;
        case 'add-to-cart-and-close': this.addToCart(id!); this.closeCheckout(); break;
        case 'open-vip-from-detail': this.closeCheckout(); this.openVipRequest(id!); break;
        case 'qty-dec': this.changeQty(id!, -1); break;
        case 'qty-inc': this.changeQty(id!, 1); break;
        case 'remove-item': this.removeItem(id!); break;
        case 'open-checkout': this.openCheckout(); break;
        case 'close-checkout': this.closeCheckout(); break;
        case 'submit-order': this.submitOrder(); break;
        case 'finish-order': this.finishOrder(); break;
        case 'submit-vip-request': this.submitVipRequest(id!); break;
        case 'submit-login': this.submitLogin(target.dataset.tab ?? 'my_bids'); break;
        case 'logout': e.preventDefault(); this.logout(); break;
        case 'cabinet-tab': {
          const newTab = target.dataset.tab ?? 'my_lots';
          if (newTab !== 'create') this.editingLotId = null;
          this.openCabinet(newTab);
          break;
        }
        case 'set-role': this.setRole(target.dataset.role as DashboardRole); break;
        case 'remove-listing': this.removeListing(id!); break;
        case 'edit-listing': this.editListing(id!); break;
        case 'cancel-edit-listing': this.cancelEditListing(); break;
        case 'publish-listing': this.publishListing(); break;
        case 'send-lot-chat': this.sendLotChat(id!, target.dataset.seller ?? ''); break;
        case 'open-lightbox': e.stopPropagation(); this.openLightbox(id!, parseInt(target.dataset.idx ?? '0', 10)); break;
        case 'lightbox-prev': e.stopPropagation(); this.lightboxStep(-1); break;
        case 'lightbox-next': e.stopPropagation(); this.lightboxStep(1); break;
        case 'lightbox-close': this.closeLightbox(); break;
      }
    });
  }
}

// Methods are split across catalog.ts / cart.ts / lot-detail.ts / cabinet.ts for maintainability
// (see dev-review feedback re: app.ts size) and merged onto the prototype here.
Object.assign(VintageHallApp.prototype, catalogMethods, cartMethods, lotDetailMethods, cabinetMethods);

document.addEventListener('DOMContentLoaded', () => {
  new VintageHallApp().init();
});
