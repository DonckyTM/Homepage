import { SiteShell } from "@/components/SiteShell";
import { getSiteTexts } from "@/lib/data/siteTexts";
import { getSiteSettings } from "@/lib/data/siteSettings";
import { getHomeFacts } from "@/lib/data/homeFacts";
import { getAboutFacts } from "@/lib/data/aboutFacts";
import { getStack } from "@/lib/data/stack";
import { getProjects } from "@/lib/data/projects";
import { getMilestones } from "@/lib/data/milestones";
import { buildTabs } from "@/lib/data/tabs";
import { getBrandLogoUrl } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const [siteTexts, siteSettings, homeFacts, aboutFacts, stack, projects, milestones] = await Promise.all([
    getSiteTexts(supabase),
    getSiteSettings(supabase),
    getHomeFacts(supabase),
    getAboutFacts(supabase),
    getStack(supabase),
    getProjects(supabase),
    getMilestones(supabase)
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
      brandLogoUrl={getBrandLogoUrl(siteSettings.brand_logo_path)}
      editable
    />
  );
}
