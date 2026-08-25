import type { SupabaseClient } from "@supabase/supabase-js";
import { AboutFact, HomeFact, Localized, Milestone, Project, StackTag } from "@/lib/types";

// Whole-page content in a single database round trip.
//
// Every section used to fetch its own table (seven PostgREST requests per
// render). They ran in parallel but the page still waited for the slowest one,
// and each paid its own HTTP/auth/planning cost. `get_site_content()`
// (supabase/migrations/20260825131913_site_content_rpc.sql) returns all of it
// as one jsonb document, already ordered by "order".

interface SiteTextRow {
  key: string;
  value_de: string;
  value_en: string;
}

interface SiteSettingRow {
  key: string;
  value: string | null;
}

interface FactRow {
  id: string;
  order: number;
  label_de: string;
  label_en: string;
  value_de: string;
  value_en: string;
}

interface StackRow {
  id: string;
  order: number;
  name: string;
  icon: string | null;
}

interface ProjectRow {
  id: string;
  order: number;
  title_de: string;
  title_en: string;
  blurb_de: string;
  blurb_en: string;
  long1_de: string;
  long1_en: string;
  long2_de: string;
  long2_en: string;
  role_de: string;
  role_en: string;
  year_de: string;
  year_en: string;
  tech_tags: string[] | null;
  repo_url: string | null;
  screenshot_path: string | null;
  screenshot_blur: string | null;
  in_progress: boolean;
}

interface MilestoneRow {
  id: string;
  order: number;
  title_de: string;
  title_en: string;
  note_de: string;
  note_en: string;
  date_de: string;
  date_en: string;
  done: boolean;
}

interface SiteContentPayload {
  site_texts: SiteTextRow[];
  site_settings: SiteSettingRow[];
  home_facts: FactRow[];
  about_facts: FactRow[];
  about_stack: StackRow[];
  projects: ProjectRow[];
  milestones: MilestoneRow[];
}

export interface SiteContent {
  siteTexts: Record<string, Localized>;
  siteSettings: Record<string, string | null>;
  homeFacts: HomeFact[];
  aboutFacts: AboutFact[];
  stack: StackTag[];
  projects: Project[];
  milestones: Milestone[];
}

function toFact(row: FactRow): HomeFact & AboutFact {
  return {
    id: row.id,
    order: row.order,
    label: { de: row.label_de, en: row.label_en },
    value: { de: row.value_de, en: row.value_en }
  };
}

export async function getSiteContent(supabase: SupabaseClient): Promise<SiteContent> {
  const { data, error } = await supabase.rpc("get_site_content");

  if (error) {
    throw new Error(`Failed to load site content: ${error.message}`);
  }

  const payload = data as SiteContentPayload;

  const siteTexts: Record<string, Localized> = {};
  for (const row of payload.site_texts) {
    siteTexts[row.key] = { de: row.value_de, en: row.value_en };
  }

  const siteSettings: Record<string, string | null> = {};
  for (const row of payload.site_settings) {
    siteSettings[row.key] = row.value;
  }

  return {
    siteTexts,
    siteSettings,
    homeFacts: payload.home_facts.map(toFact),
    aboutFacts: payload.about_facts.map(toFact),
    stack: payload.about_stack.map((row) => ({
      id: row.id,
      order: row.order,
      name: row.name,
      icon: row.icon ?? undefined
    })),
    projects: payload.projects.map((row) => ({
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
      screenshotBlur: row.screenshot_blur ?? null,
      // Placeholder shown until a real screenshot is uploaded (see screenshotPath).
      screenshotLabel: { en: "screenshot", de: "screenshot" },
      inProgress: row.in_progress
    })),
    milestones: payload.milestones.map((row) => ({
      id: row.id,
      order: row.order,
      title: { de: row.title_de, en: row.title_en },
      note: { de: row.note_de, en: row.note_en },
      date: { de: row.date_de, en: row.date_en },
      done: row.done
    }))
  };
}
