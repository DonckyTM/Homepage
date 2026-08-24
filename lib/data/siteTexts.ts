import { Localized } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

// Site-Texte: Hero, About-Absätze, Section-Labels, Tab-Labels — keyed, DE/EN.
// Loaded from the `site_texts` table; tab labels are stored under `tab_*` keys.
export async function getSiteTexts(): Promise<Record<string, Localized>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_texts").select("key, value_de, value_en");

  if (error) {
    throw new Error(`Failed to load site_texts: ${error.message}`);
  }

  const texts: Record<string, Localized> = {};
  for (const row of data ?? []) {
    texts[row.key] = { de: row.value_de, en: row.value_en };
  }
  return texts;
}
