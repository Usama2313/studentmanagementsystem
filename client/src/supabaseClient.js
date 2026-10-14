// client/src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  'https://demo-gcc-schools.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  'public-anon-key-gcc-schools-2026';

export const isLiveSupabase = Boolean(
  (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('demo-gcc-schools')) ||
  (import.meta.env.SUPABASE_URL && !import.meta.env.SUPABASE_URL.includes('demo-gcc-schools'))
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
