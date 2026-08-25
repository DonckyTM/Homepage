import { Project } from "@/lib/types";
import { SupabaseServerClient } from "@/lib/supabase/server";

// Projekte: Titel, Kurzbeschreibung, Langtext, Rolle, Jahr, Tech-Tags, Repo-Link, Screenshot.
// Loaded from the `projects` table, ordered by "order".
export async function getProjects(supabase: SupabaseServerClient): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title_de, title_en, blurb_de, blurb_en, long1_de, long1_en, long2_de, long2_en, role_de, role_en, year_de, year_en, tech_tags, repo_url, screenshot_path, in_progress, order"
    )
    .order("order");

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    order: row.order,
    title: { de: row.title_de, en: row.title_en },
    blurb: { de: row.blurb_de, en: row.blurb_en },
    long1: { de: row.long1_de, en: row.long1_en },
    long2: { de: row.long2_de, en: row.long2_en },
    role: { de: row.role_de, en: row.role_en },
    year: { de: row.year_de, en: row.year_en },
    techTags: row.tech_tags ?? [],
    repoUrl: row.repo_url ?? "",
    screenshotPath: row.screenshot_path ?? null,
    // Placeholder shown until a real screenshot is uploaded (see screenshotPath).
    screenshotLabel: { en: "screenshot", de: "screenshot" },
    inProgress: row.in_progress
  }));
}
