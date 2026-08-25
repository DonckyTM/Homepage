import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client — bypasses Row Level Security entirely. Server-only:
// never import this from a Client Component or anything bundled for the
// browser. Reserved for tables with no RLS policy for anon/authenticated,
// e.g. contact_submissions (see supabase/migrations/20260824080617_content_tables_rls.sql).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
