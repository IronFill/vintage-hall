-- Vintage Hall — Supabase schema
-- Mirrors the current in-memory data model (see src/types.ts, src/data/products.ts) so that
-- migrating off localStorage is a matter of swapping reads/writes, not redesigning the data.
--
-- How to use:
--   1. Create a project at https://supabase.com
--   2. Open the SQL editor and run this whole file once.
--   3. Copy your Project URL + anon key into .env (see .env.example).
--   4. Wire up src/lib/supabase.ts calls where app.ts/cabinet.ts/catalog.ts currently
--      read/write `this.products`, `this.favorites`, localStorage, etc. — one feature at a time.

-- ---------- profiles (extends Supabase auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'buyer' check (role in ('buyer', 'seller')),
  rating numeric(3,2) default 5.0,
  sales_count integer default 0,
  verified boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users manage their own profile" on public.profiles for all using (auth.uid() = id);

-- ---------- products / lots ----------
create table if not exists public.products (
  id bigint generated always as identity primary key,
  seller_id uuid references public.profiles(id) on delete set null,
  icon text not null,
  category text not null,
  sale_type text not null check (sale_type in ('shop', 'auction', 'request')),
  photo text,
  extra_photos text[],
  name jsonb not null,        -- { uk: "...", en: "...", pl: "...", ru: "..." }
  era jsonb,
  description jsonb,
  price numeric,
  start_price numeric,
  current_bid numeric,
  bid_step numeric,
  end_time timestamptz,
  origin text,
  material text,
  condition_grade text,
  dimensions text,
  weight text,
  rarity text check (rarity in ('common', 'rare', 'unique')),
  badge text,
  certified boolean default false,
  provenance jsonb,
  investment_rating smallint,
  price_growth_pct numeric,
  price_growth_years smallint,
  created_at timestamptz default now()
);

alter table public.products enable row level security;
create policy "Products are publicly readable" on public.products for select using (true);
create policy "Sellers manage their own products" on public.products for all using (auth.uid() = seller_id);

-- ---------- bids ----------
create table if not exists public.bids (
  id bigint generated always as identity primary key,
  product_id bigint references public.products(id) on delete cascade,
  bidder_id uuid references public.profiles(id) on delete set null,
  amount numeric not null,
  created_at timestamptz default now()
);

alter table public.bids enable row level security;
create policy "Bids are publicly readable" on public.bids for select using (true);
create policy "Authenticated users can place bids" on public.bids for insert with check (auth.uid() = bidder_id);

-- ---------- favorites ----------
create table if not exists public.favorites (
  user_id uuid references public.profiles(id) on delete cascade,
  product_id bigint references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, product_id)
);

alter table public.favorites enable row level security;
create policy "Users manage their own favorites" on public.favorites for all using (auth.uid() = user_id);

-- ---------- reviews ----------
create table if not exists public.reviews (
  id bigint generated always as identity primary key,
  product_id bigint references public.products(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  text text not null,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;
create policy "Reviews are publicly readable" on public.reviews for select using (true);
create policy "Authenticated users can leave reviews" on public.reviews for insert with check (auth.uid() = author_id);

-- ---------- realtime (for live bidding) ----------
-- Run once, after creating the tables:
-- alter publication supabase_realtime add table public.bids, public.products;
