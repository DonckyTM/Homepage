import { AboutFact } from "@/lib/types";
import { SupabaseServerClient } from "@/lib/supabase/server";

// About – Fakten-Tabelle: Rolle, Unternehmen, Lehrjahr, Standort, Schwerpunkt.
// Loaded from the `about_facts` table, ordered by "order".
export async function getAboutFacts(supabase: SupabaseServerClient): Promise<AboutFact[]> {
  const { data, error } = await supabase
    .from("about_facts")
    .select("id, label_de, label_en, value_de, value_en, order")
    .order("order");

  if (error) {
    throw new Error(`Failed to load about_facts: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    order: row.order,
    label: { de: row.label_de, en: row.label_en },
    value: { de: row.value_de, en: row.value_en }
  }));
}
