import { SiteShell } from "@/components/SiteShell";
import { getSiteTexts } from "@/lib/data/siteTexts";
import { getHomeFacts } from "@/lib/data/homeFacts";
import { getAboutFacts } from "@/lib/data/aboutFacts";
import { getStack } from "@/lib/data/stack";
import { getProjects } from "@/lib/data/projects";
import { getMilestones } from "@/lib/data/milestones";
import { buildTabs } from "@/lib/data/tabs";

export default async function AdminPage() {
  const [siteTexts, homeFacts, aboutFacts, stack, projects, milestones] = await Promise.all([
    getSiteTexts(),
    getHomeFacts(),
    getAboutFacts(),
    getStack(),
    getProjects(),
    getMilestones()
  ]);

  const tabs = buildTabs(siteTexts);

  return (
    <SiteShell
      siteTexts={siteTexts}
      homeFacts={homeFacts}
      aboutFacts={aboutFacts}
      stack={stack}
      projects={projects}
      milestones={milestones}
      tabs={tabs}
      editable
    />
  );
}
