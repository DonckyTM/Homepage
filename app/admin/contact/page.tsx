import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { ContactInboxView, type Submission } from "@/components/admin/ContactInboxView";

// Uses the service-role client directly (no cookies()/session read), so
// Next can't infer this needs per-request rendering on its own — force it,
// otherwise the inbox would be statically prerendered once at build time.
export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  // This page reads every submission's name, email and message with RLS
  // bypassed, so it authorizes the viewer itself rather than trusting the
  // middleware matcher to be the only gate.
  await requireAdmin({ rateLimit: false });

  // contact_submissions has no RLS read policy for authenticated users either
  // (see supabase/migrations/20260824080617_content_tables_rls.sql) — only
  // the service role bypasses RLS, so this page can't use the regular
  // session-scoped client used elsewhere in app/admin.
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load contact_submissions: ${error.message}`);
  }

  const submissions = (data ?? []) as Submission[];

  return <ContactInboxView submissions={submissions} />;
}
