import { AboutFact, HomeFact } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

// About – Fakten-Tabelle: Rolle, Unternehmen, Lehrjahr, Standort, Schwerpunkt.
// Loaded from the `about_facts` table, ordered by "order".
export async function getAboutFacts(): Promise<AboutFact[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_facts")
    .select("label_de, label_en, value_de, value_en, order")
    .order("order");

  if (error) {
    throw new Error(`Failed to load about_facts: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    order: row.order,
    label: { de: row.label_de, en: row.label_en },
    value: { de: row.value_de, en: row.value_en }
  }));
}

// Condensed subset shown as the three fact cards on the Home tab.
// No dedicated DB table exists yet (see issue #5 follow-ups) — stays hardcoded for now.
export const homeFacts: HomeFact[] = [
  { order: 1, label: { en: "Role", de: "Rolle" }, value: { en: "SWE Apprentice", de: "SWE-Azubi" } },
  { order: 2, label: { en: "Based in", de: "Standort" }, value: { en: "Frankfurt a. M.", de: "Frankfurt a. M." } },
  { order: 3, label: { en: "Focus", de: "Schwerpunkt" }, value: { en: "Backend · C++", de: "Backend · C++" } }
];
