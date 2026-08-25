import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Anon client for public, session-independent reads.
//
// The cookie-bound client in ./server.ts forces every page that touches it into
// dynamic rendering, because reading cookies opts the route out of the full
// route cache. The public site's content is identical for every visitor and
// governed by the "public read" RLS policies, so it needs no session at all —
// using this client lets `/` be rendered once and revalidated on edit instead
// of re-queried on every request.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
