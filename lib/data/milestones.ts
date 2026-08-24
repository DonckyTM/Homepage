import { Milestone } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

// Build-Log / Meilensteine. Fortschritt wird daraus berechnet, nicht gespeichert.
// Loaded from the `milestones` table, ordered by "order".
export async function getMilestones(): Promise<Milestone[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("milestones")
    .select("id, title_de, title_en, note_de, note_en, date_de, date_en, done, order")
    .order("order");

  if (error) {
    throw new Error(`Failed to load milestones: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    order: row.order,
    title: { de: row.title_de, en: row.title_en },
    note: { de: row.note_de, en: row.note_en },
    date: { de: row.date_de, en: row.date_en },
    done: row.done
  }));
}
