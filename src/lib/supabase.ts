import { createBrowserClient } from "@supabase/ssr";

// These will be set via environment variables in production
// For development, users will need to set up their own Supabase project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Check if Supabase is configured
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
