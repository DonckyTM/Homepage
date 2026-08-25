import { StackTag } from "@/lib/types";
import { SupabaseServerClient } from "@/lib/supabase/server";

// About – Stack/Tags. Names aren't translated (technology names).
// Loaded from the `about_stack` table, ordered by "order".
export async function getStack(supabase: SupabaseServerClient): Promise<StackTag[]> {
  const { data, error } = await supabase.from("about_stack").select("id, name, icon, order").order("order");

  if (error) {
    throw new Error(`Failed to load about_stack: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    order: row.order,
    name: row.name,
    icon: row.icon ?? undefined
  }));
}
