import { SupabaseServerClient } from "@/lib/supabase/server";

// Singleton, non-localized settings (currently just the header logo path).
// Kept separate from site_texts since it isn't DE/EN copy.
export async function getSiteSettings(supabase: SupabaseServerClient): Promise<Record<string, string | null>> {
  const { data, error } = await supabase.from("site_settings").select("key, value");

  if (error) {
    throw new Error(`Failed to load site_settings: ${error.message}`);
  }

  const settings: Record<string, string | null> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }
  return settings;
}
