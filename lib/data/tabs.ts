import { TabDef } from "@/lib/types";
import { tabLabels } from "@/lib/data/siteTexts";

export const tabs: TabDef[] = [
  { id: "home", label: tabLabels.home },
  { id: "about", label: tabLabels.about },
  { id: "projects", label: tabLabels.projects },
  { id: "current", label: tabLabels.current }
];
