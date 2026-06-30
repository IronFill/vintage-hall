// Core domain types for the Vintage Hall marketplace prototype.

export type Lang = 'uk' | 'en' | 'pl' | 'ru';
export type Theme = 'dark' | 'light';
export type Category =
  | 'decor' | 'numismatics' | 'special' | 'porcelain'
  | 'silver' | 'painting' | 'militaria' | 'jewelry'
  | 'clocks' | 'glass' | 'philately' | 'books';
export type IconKey = 'samovar' | 'watch' | 'vase' | 'candle' | 'mirror' | 'box' | 'coin' | 'figurine' | 'painting' | 'medal' | 'ring' | 'sword';
export type SortMode = 'default' | 'price-asc' | 'price-desc' | 'new' | 'ending-soon';
export type CatalogFilter = 'all' | 'favorites' | Category;
export type Rarity = 'common' | 'rare' | 'unique';
export type Badge = 'premium' | 'expert' | 'museum' | 'certified' | 'rare';

/** Transaction mechanism for a listing, independent of its item category. */
export type SaleType = 'shop' | 'auction' | 'request';

export type DashboardRole = 'buyer' | 'seller';

export interface ProductText {
  name: string;
  era: string;
  desc: string;
}

/** Translated copy for a seeded (curated) product, one entry per language. */
export type ProductI18n = Record<Lang, ProductText>;

/** User-entered copy for a listing created through the cabinet — language-agnostic. */
export interface CustomListingText extends ProductText {
  material?: string;
  condition?: string;
}

export interface BidRecord {
  user: string;
  bid: number;
  time: string;
}

/** Lightweight seller profile — enough to show trust signals without a full seller-page system. */
export interface SellerInfo {
  rating: number;
  salesCount: number;
  yearsActive: number;
  verified: boolean;
}

/** Verifying expert profile (addresses "Система экспертов" feedback) — credentials shown
    on any lot they've verified, plus a standalone /experts overview. Demo seed data, Ukrainian-only
    (same convention as reviews/Q&A: chrome around it is translated, the content itself isn't). */
export interface Expert {
  id: string;
  name: string;
  specialization: string;
  yearsExperience: number;
  verificationsCount: number;
  rating: number;
  bio: string;
}

/** A completed sale shown in the homepage "recently sold" feed — demo data computed from
    real product fields (start price vs. final price), not fabricated numbers. */
export interface RecentSale {
  productId: number;
  soldMinutesAgo: number;
}

export interface Product {
  id: number;
  icon: IconKey;
  category: Category;
  seller: string;
  saleType: SaleType;
  photo?: string | null;
  /** Additional supporting photos (e.g. maker's mark) shown in the lot detail view. */
  extraPhotos?: string[];
  /** Optional video walkthrough — a link (YouTube/Vimeo/etc.), not a hosted file: this demo has
      no media-streaming backend, so uploading and serving raw video would be faked. A link is the
      honest equivalent of what a real seller would paste in today. */
  videoUrl?: string | null;

  /** Fixed-price listings (saleType === 'shop'). */
  price?: number;

  /** Auction listings (saleType === 'auction'). */
  startPrice?: number;
  currentBid?: number;
  bidStep?: number;
  bidsCount?: number;
  endTime?: string;
  bidHistory?: BidRecord[];
  /** How many people are looking at this lot right now — auction urgency cue. */
  watchingNow?: number;
  bidsLastHour?: number;

  /** Richer card/detail data, addressing the "thin card" feedback. */
  conditionGrade?: string;
  dimensions?: string;

  /** Buyer reviews of this specific lot/seller transaction — trust signal for the antiques niche. */
  reviews?: { author: string; rating: number; text: string; date: string }[];
  weight?: string;
  origin?: string;
  rarity?: Rarity;
  badge?: Badge;
  certified?: boolean;
  provenance?: Record<Lang, string>;

  /** Investment angle (#13 from product review): a 1–5 rating plus historical growth, shown only
      for items where this framing makes sense (coins, paintings, jewelry) — not generic decor. */
  investmentRating?: number;
  priceGrowthPct?: number;
  priceGrowthYears?: number;
  /** Comparable sale prices over time, e.g. [{year:2022,price:350}, ...] — shown as a simple price-history list. */
  priceHistory?: { year: number; price: number }[];

  /** Links this lot to an expert profile (see data/experts.ts) who verified it — addresses
      "Система экспертов" feedback: shown as a credentialed verification block, not just a generic badge. */
  expertId?: string;

  /** Public Q&A thread under the lot ("Це оригінал?" / expert answers) — distinct from the private
      buyer-seller chat (renderLotChat). Seeded demo content, read-only (no backend to persist new posts). */
  qa?: { author: string; question: string; answerAuthor: string; answerIsExpert?: boolean; answer: string }[];

  /** Present only for user-created listings; absent for seeded catalog items. */
  custom?: CustomListingText;
}

export interface CartItem {
  id: number;
  qty: number;
  icon: IconKey;
  price?: number;
  custom?: CustomListingText;
}

export interface PurchaseRecord {
  date: string;
  itemNames: string;
  total: number;
}

/** Flat dictionary of every translatable UI string, keyed by translation id. */
export interface UiStrings {
  tagline: string;
  nav_catalog: string;
  nav_about: string;
  nav_contacts: string;
  nav_news: string;
  nav_forum: string;
  cart_btn: string;
  hero_eyebrow: string;
  hero_h1_pre: string;
  hero_h1_em: string;
  hero_p: string;
  btn_catalog: string;
  btn_about: string;
  hero_stamp: string;
  catalog_title: string;
  count_unit: string;
  count_in_section: string;
  tab_all: string;
  tab_decor: string;
  tab_numismatics: string;
  tab_vip: string;
  tab_porcelain: string;
  tab_favorites: string;
  search_ph: string;
  sort_default: string;
  sort_price_asc: string;
  sort_price_desc: string;
  sort_new: string;
  sort_ending_soon: string;
  empty_favorites: string;
  total_lots: string;
  about_quote: string;
  about_p1: string;
  about_p2: string;
  footer_copyright: string;
  footer_rules: string;
  footer_delivery: string;
  rules_text: string;
  cart_title: string;
  cart_empty: string;
  cart_total: string;
  cart_checkout: string;
  cart_remove: string;
  checkout_title: string;
  checkout_sub: string;
  field_name: string;
  field_phone: string;
  field_delivery: string;
  opt_np: string;
  opt_courier: string;
  opt_pickup: string;
  field_address: string;
  pay_note: string;
  btn_cancel: string;
  btn_confirm: string;
  confirm_title: string;
  confirm_sub: string;
  confirm_sub2: string;
  btn_done: string;
  vip_title: string;
  field_contact: string;
  vip_note: string;
  btn_send: string;
  vip_confirm_title: string;
  vip_confirm_sub: string;
  label_material: string;
  label_condition: string;
  label_category: string;
  label_delivery: string;
  label_watchers: string;
  label_photo: string;
  label_seller: string;
  btn_close: string;
  btn_view: string;
  delivery_note: string;
  nav_account: string;
  login_title: string;
  field_login_name: string;
  btn_login: string;
  cabinet_title: string;
  tab_my_lots: string;
  tab_create: string;
  tab_purchases: string;
  empty_my_lots: string;
  empty_purchases: string;
  field_lot_name: string;
  field_lot_era: string;
  field_lot_desc: string;
  field_lot_price: string;
  field_lot_icon: string;
  field_lot_photo: string;
  field_lot_extra_photos: string;
  hint_lot_extra_photos: string;
  field_lot_video: string;
  hint_lot_video: string;
  field_lot_story: string;
  placeholder_lot_story: string;
  label_video_walkthrough: string;
  btn_choose_file: string;
  label_no_file_chosen: string;
  label_files_chosen: string;
  btn_publish: string;
  publish_success: string;
  btn_remove_listing: string;
  btn_edit_listing: string;
  label_editing_lot: string;
  btn_save_changes: string;
  label_sale_price: string;
  label_platform_fee: string;
  label_net_payout: string;
  label_views: string;
  btn_compare: string;
  compare_title: string;
  compare_selected_label: string;
  compare_limit_msg: string;
  label_price: string;
  label_reviews: string;
  reviews_empty: string;

  // Expert verification (Система экспертов)
  label_expert_verification: string;
  label_years_experience: string;
  label_verifications: string;

  // Public Q&A under a lot
  label_qa: string;
  qa_empty: string;

  // Seller profile + follow
  btn_view_seller_profile: string;
  btn_follow_seller: string;
  btn_unfollow_seller: string;
  seller_profile_title: string;
  label_seller_all_lots: string;

  // Similar lots
  label_similar_lots: string;

  // Collector portfolio ("Моя колекція")
  tab_my_collection: string;
  label_collection_value: string;
  label_collection_growth: string;
  label_collection_items: string;
  empty_collection: string;

  // Recently sold feed
  label_just_sold_feed: string;
  label_sold_minutes_ago: string;
  label_sold_for: string;
  logged_in_as: string;
  btn_logout: string;
  add_lot_btn: string;

  mode_shop: string;
  mode_auction: string;
  field_sale_type: string;
  opt_sale_shop: string;
  opt_sale_auction: string;
  opt_sale_request: string;
  field_start_price: string;
  field_duration: string;
  label_current_bid: string;
  label_start_price: string;
  label_bids_count: string;
  label_time_left: string;
  auction_ended: string;
  btn_place_bid: string;
  bid_login_required: string;
  bid_placed_as: string;
  label_bid_history: string;
  no_bids_yet: string;
  role_buyer: string;
  role_seller: string;
  tab_my_bids: string;
  tab_won_lots: string;
  tab_wallet: string;
  empty_my_bids: string;
  empty_won_lots: string;
  status_leading: string;
  status_outbid: string;
  wallet_balance: string;
  wallet_note: string;
  wallet_commission_history: string;
  wallet_no_history: string;
  sidebar_categories: string;

  // Expanded category tabs
  tab_silver: string;
  tab_painting: string;
  tab_militaria: string;
  tab_jewelry: string;
  tab_clocks: string;
  tab_glass: string;
  tab_philately: string;
  tab_books: string;

  // Homepage trust bar
  trust_rating: string;
  trust_deals: string;
  trust_sellers_buyers: string;
  trust_volume: string;
  trust_online: string;

  // "Why buy here" value props
  why_buy_title: string;
  why_verified_sellers: string;
  why_expertise: string;
  why_safe_deal: string;
  why_return_guarantee: string;
  why_delivery_ua: string;
  why_intl_delivery: string;

  // Safety / escrow explainer
  safety_title: string;
  safety_step1: string;
  safety_step2: string;
  safety_step3: string;
  safety_step4: string;

  // Richer card / detail fields
  label_dimensions: string;
  label_weight: string;
  label_grade: string;
  label_origin: string;
  label_rarity: string;
  label_provenance: string;
  label_certified_short: string;
  rarity_common: string;
  rarity_rare: string;
  rarity_unique: string;
  badge_premium: string;
  badge_expert: string;
  badge_museum: string;
  badge_certified: string;
  badge_rare: string;

  // Seller mini-profile
  seller_rating: string;
  seller_sales: string;
  seller_years: string;
  seller_verified: string;

  // Live-auction emotion
  label_watching_now: string;
  label_bids_last_hour: string;
  label_min_next_bid: string;
  btn_autobid: string;
  field_autobid_max: string;
  autobid_set: string;

  // Advanced filters
  filter_material: string;
  filter_origin: string;
  filter_rarity: string;
  filter_any: string;

  // Rarity tier dots (#12)
  rarity_dot_common: string;
  rarity_dot_rare: string;
  rarity_dot_unique: string;
  rarity_dot_museum: string;

  // Investment block (#13)
  label_investment: string;
  label_price_growth: string;
  label_price_growth_years: string;

  // Price history (#6)
  label_price_history: string;
  label_similar_sold: string;

  // Hero rewrite (#1)
  hero_h1_new: string;
  hero_sub_new: string;
  btn_view_auctions: string;
  btn_sell_item: string;

  // Live activity strip (#9)
  activity_today: string;
  activity_active_auctions: string;
  activity_new_bids: string;
  activity_new_sellers: string;
  activity_just_sold: string;

  // Collections section (#10)
  collections_title: string;
  collections_sub: string;
  collection_porcelain: string;
  collection_militaria: string;
  collection_numismatics: string;
  collection_painting: string;
  collection_clocks: string;
  collection_jewelry: string;

  // Cabinet additions (#14)
  tab_my_favorites: string;
  tab_my_sellers: string;
  empty_my_sellers: string;
  seller_member_since: string;
  seller_positive_pct: string;
}

export type Translations = Record<Lang, UiStrings>;
export type MaterialByIcon = Record<IconKey, Record<Lang, string>>;
export type ConditionByCategory = Record<Category, Record<Lang, string>>;
export type IconLabels = Record<IconKey, Record<Lang, string>>;
export type IconPaths = Record<IconKey, string>;

// News & Forum types
export type NewsCategory = 'numismatics' | 'archaeology' | 'architecture' | 'interviews' | 'auctions';

export interface NewsArticle {
  id: number;
  category: NewsCategory;
  title: Record<Lang, string>;
  excerpt: Record<Lang, string>;
  body: Record<Lang, string>;
  date: string;
  author: string;
  imageUrl: string;
}

export interface ForumTopic {
  id: number;
  title: string;
  body: string;
  author: string;
  date: string;
  category: string;
  replies: ForumReply[];
  views: number;
  /** Pinned topics (admin announcements, contests, promos) render above regular ones. */
  pinned?: boolean;
  /** Visual tag for promo/contest/event threads — purely cosmetic, doesn't affect category filtering. */
  topicType?: 'promo' | 'contest' | 'event' | 'announcement';
}

export interface ForumReply {
  author: string;
  text: string;
  date: string;
}

export interface QuickMessage {
  author: string;
  text: string;
  date: string;
}
