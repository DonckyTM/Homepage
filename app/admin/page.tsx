import { SiteShell } from "@/components/SiteShell";
import { getSiteContent } from "@/lib/data/siteContent";
import { buildTabs } from "@/lib/data/tabs";
import { getBrandLogoUrl } from "@/lib/supabase/storage";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  // Session-bound client here: the admin view must reflect unsaved-through-RLS
  // reality for the logged-in user and must never be cached.
  const supabase = await createClient();
  const content = await getSiteContent(supabase);
  const tabs = buildTabs(content.siteTexts);

  return (
    <SiteShell
      siteTexts={content.siteTexts}
      homeFacts={content.homeFacts}
      aboutFacts={content.aboutFacts}
      stack={content.stack}
      projects={content.projects}
      milestones={content.milestones}
      tabs={tabs}
      brandLogoUrl={getBrandLogoUrl(content.siteSettings.brand_logo_path)}
      editable
    />
  );
}
