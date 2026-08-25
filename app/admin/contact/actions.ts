"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// contact_submissions has no RLS policy for authenticated users (see
// supabase/migrations/20260824080617_content_tables_rls.sql), so this must go
// through the service-role client rather than the session-scoped one used in
// app/admin/actions.ts.
//
// Because the service role bypasses RLS, there is no database-level backstop
// here -- requireAdmin() IS the authorization boundary. Without it this action
// was invokable unauthenticated: Server Action IDs are global, so POSTing this
// one to "/" sidesteps the /admin middleware matcher entirely.
export async function deleteContactSubmissionInline(id: string) {
  await requireAdmin();

  if (!UUID_RE.test(id)) {
    throw new Error("Invalid submission id.");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_submissions").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete contact submission.");
  }

  revalidatePath("/admin/contact");
}
