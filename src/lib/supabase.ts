import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The publishable (anon) key is public by design — it ships in the client bundle and all
// access is gated by Row Level Security. No hardcoded fallback project: without these two
// env vars set, every build (CI, previews, forks) stays on local-only demo data, opt-in only.
const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

/**
 * The live Supabase client, or `null` when PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY
 * aren't set (see .env.example). When configured, auth-page.ts and cabinet.ts use it as the
 * real source of truth for registration/login/password reset (see auth-page.ts's submitRegister/
 * submitLogin/submitReset), mirroring the result into the local StoredUser cache (auth-store.ts)
 * so the rest of the app keeps reading it synchronously. Products/bids/favorites are not migrated
 * yet — those still read `this.products` / `this.favorites` regardless of this client's state.
 *
 * Usage once configured:
 *   import { supabase } from '../lib/supabase';
 *   if (supabase) {
 *     const { data, error } = await supabase.from('products').select('*');
 *   }
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

if (!supabase && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(
    '[supabase] PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY not set — running on local demo data only. ' +
    'See .env.example and supabase/schema.sql to connect a real project.'
  );
}
