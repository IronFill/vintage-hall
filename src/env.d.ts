/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Google Analytics 4 measurement ID, e.g. G-XXXXXXXXXX. Leave unset to disable GA entirely. */
  readonly PUBLIC_GA_ID?: string;
  /** Yandex Metrica counter ID (numeric). Leave unset to disable Metrica entirely. */
  readonly PUBLIC_YM_COUNTER_ID?: string;
  /** Supabase project URL, e.g. https://xxxxx.supabase.co — see src/lib/supabase.ts */
  readonly PUBLIC_SUPABASE_URL?: string;
  /** Supabase anon/public API key (safe to expose client-side; protected by RLS policies). */
  readonly PUBLIC_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
