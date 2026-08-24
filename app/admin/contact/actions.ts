"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

// contact_submissions has no RLS policy for authenticated users (see
// supabase/migrations/20260824080617_content_tables_rls.sql), so this must
// go through the service-role client rather than the session-scoped one
// used in app/admin/actions.ts.
export async function deleteContactSubmissionInline(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_submissions").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete contact submission: ${error.message}`);
  }

  revalidatePath("/admin/contact");
}
