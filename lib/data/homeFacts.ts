import { HomeFact } from "@/lib/types";
import { SupabaseServerClient } from "@/lib/supabase/server";

// Home tab fact cards: role, based in, focus. Loaded from the `home_facts`
// table, ordered by "order".
export async function getHomeFacts(supabase: SupabaseServerClient): Promise<HomeFact[]> {
  const { data, error } = await supabase
    .from("home_facts")
    .select("id, label_de, label_en, value_de, value_en, order")
    .order("order");

  if (error) {
    throw new Error(`Failed to load home_facts: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    order: row.order,
    label: { de: row.label_de, en: row.label_en },
    value: { de: row.value_de, en: row.value_en }
  }));
}
