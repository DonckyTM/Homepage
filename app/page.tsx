import { SiteShell } from "@/components/SiteShell";
import { getSiteTexts } from "@/lib/data/siteTexts";
import { getAboutFacts, homeFacts } from "@/lib/data/aboutFacts";
import { getStack } from "@/lib/data/stack";
import { getProjects } from "@/lib/data/projects";
import { getMilestones } from "@/lib/data/milestones";
import { buildTabs } from "@/lib/data/tabs";

export default async function Page() {
  const [siteTexts, aboutFacts, stack, projects, milestones] = await Promise.all([
    getSiteTexts(),
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
    />
  );
}
