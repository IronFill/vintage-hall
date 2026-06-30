import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

/**
 * The live Supabase client, or `null` when PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY
 * aren't set (see .env.example). The rest of the app currently runs entirely on in-memory
 * state + localStorage (see scripts/app.ts, cabinet.ts, etc.) and does NOT call this client —
 * it's provided as a ready-to-wire-in foundation for migrating off localStorage, not a drop-in
 * replacement. Wiring it in means swapping specific calls (e.g. publishListing, placeBid,
 * toggleFavorite) to read/write Supabase tables instead of `this.products` / `this.favorites`,
 * ideally one feature at a time so each can be tested against a real project.
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
