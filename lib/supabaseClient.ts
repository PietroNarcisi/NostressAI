import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | undefined;

function requirePublicKeys() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured.');
  }
  return { supabaseUrl, supabaseAnonKey };
}

/**
 * Client-safe instance used in React components / browser context.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  const { supabaseUrl, supabaseAnonKey } = requirePublicKeys();
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      global: { fetch }
    });
  }
  return browserClient;
}

/**
 * Server-side helper designed for API routes, server actions, and ISR builds.
 * Requires the service role key which must never reach the browser.
 */
export function getSupabaseServiceClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseServiceClient must only be called on the server.');
  }
  const { supabaseUrl } = requirePublicKeys();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: { fetch }
  });
}
