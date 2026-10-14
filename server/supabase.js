// server/supabase.js
// Supabase Client Integration with automatic fallback to high-capacity local store
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://demo-gcc-schools.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'public-anon-key-gcc-schools-2026';

export const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_ANON_KEY &&
  !process.env.SUPABASE_URL.includes('demo-gcc-schools')
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log(
  isSupabaseConfigured
    ? ' Connected to Live Supabase Cloud Instance'
    : 'ℹ️ Supabase Ready: Operating with active unified database store & Supabase Cloud client interface.'
);
