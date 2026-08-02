import { SEEDED_PRODUCTS, PRODUCT_I18N, SELLERS } from './products';
import { UI } from './i18n';
import type { Category } from '../types';

export interface SearchItem {
  title: string;
  subtitle?: string;
  href: string;
  group: string;
}

const CATEGORY_LABEL_KEY: Record<Category, keyof typeof UI.uk> = {
  decor: 'tab_decor', numismatics: 'tab_numismatics', porcelain: 'tab_porcelain', special: 'tab_vip',
  silver: 'tab_silver', painting: 'tab_painting', militaria: 'tab_militaria', jewelry: 'tab_jewelry',
  clocks: 'tab_clocks', glass: 'tab_glass', philately: 'tab_philately', books: 'tab_books',
};

/** Standalone routes, mirroring the links already in the header nav / sitemap drawer. */
const PAGES: SearchItem[] = [
  { title: 'Каталог', href: '/catalog', group: 'Сторінки' },
  { title: 'Новини', href: '/news', group: 'Сторінки' },
  { title: 'Форум', href: '/forum', group: 'Сторінки' },
  { title: 'Про нас', href: '/about', group: 'Сторінки' },
  { title: 'Контакти', href: '/contacts', group: 'Сторінки' },
  { title: 'Доставка', href: '/delivery', group: 'Сторінки' },
  { title: 'Правила', href: '/rules', group: 'Сторінки' },
  { title: 'Гарантія автентичності', href: '/guarantee', group: 'Сторінки' },
  { title: 'Експертиза та оцінка', href: '/expertise', group: 'Сторінки' },
];

/** Homepage-only sections that have no standalone page of their own. */
const SECTIONS: SearchItem[] = [
  { title: 'Активні аукціони', href: '/#live-auctions', group: 'Розділи головної' },
  { title: 'Як це працює', href: '/#how', group: 'Розділи головної' },
];

const LOT_ITEMS: SearchItem[] = SEEDED_PRODUCTS.map((p) => ({
  title: PRODUCT_I18N[p.id]?.uk.name ?? `Лот #${p.id}`,
  subtitle: PRODUCT_I18N[p.id]?.uk.desc,
  href: `/lot/${p.id}`,
  group: 'Лоти',
}));

const CATEGORY_ITEMS: SearchItem[] = Array.from(new Set(SEEDED_PRODUCTS.map((p) => p.category))).map((cat) => ({
  title: UI.uk[CATEGORY_LABEL_KEY[cat]],
  href: `/category/${cat}`,
  group: 'Категорії',
}));

const SELLER_ITEMS: SearchItem[] = Object.entries(SELLERS).map(([name, info]) => ({
  title: name,
  subtitle: `Рейтинг ${info.rating.toFixed(1)} · ${info.salesCount} продажів`,
  href: `/seller/${encodeURIComponent(name)}`,
  group: 'Продавці',
}));

/** Built once at build time from the same data that already powers the pages — no separate
    backend, no hand-maintained list that can drift from what's actually on the site. */
export const SEARCH_INDEX: SearchItem[] = [...PAGES, ...SECTIONS, ...CATEGORY_ITEMS, ...LOT_ITEMS, ...SELLER_ITEMS];
