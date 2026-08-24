import { Localized, TabDef, TabId } from "@/lib/types";

// Tab ids and their order stay hardcoded (not part of the editable data model per
// CLAUDE.md) — only the labels come from `site_texts` (keys `tab_home`, `tab_about`,
// `tab_projects`, `tab_current`).
export const tabIds: TabId[] = ["home", "about", "projects", "current"];

export function buildTabs(texts: Record<string, Localized>): TabDef[] {
  return tabIds.map((id) => ({ id, label: texts[`tab_${id}`] }));
}
