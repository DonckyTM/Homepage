import ReactDOM from "react-dom";
import { SiteShell } from "@/components/SiteShell";
import { getSiteContent } from "@/lib/data/siteContent";
import { buildTabs } from "@/lib/data/tabs";
import { getBrandLogoUrl, getScreenshotUrl } from "@/lib/supabase/storage";
import { screenshotLoader } from "@/lib/images";
import { createPublicClient } from "@/lib/supabase/public";

// The public page is the same for every visitor, so render it once and rebuild
// it when an admin edits something (every Server Action calls
// revalidatePath("/")). The hourly fallback only matters if a row is changed
// straight from the Supabase table editor.
export const revalidate = 3600;

export default async function Page() {
  const supabase = createPublicClient();
  const content = await getSiteContent(supabase);
  const tabs = buildTabs(content.siteTexts);

  // The projects tab only mounts once it is selected, so without this the
  // screenshot request did not start until the user clicked "Projects" and
  // then had to wait out a cold optimizer round trip. Preloading from the
  // initial HTML means the bytes are already in cache by then. Low priority
  // keeps it from competing with the home tab's own rendering.
  for (const project of content.projects) {
    const url = getScreenshotUrl(project.screenshotPath);
    if (url) {
      ReactDOM.preload(screenshotLoader({ src: url }), { as: "image", fetchPriority: "low" });
    }
  }

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
    />
  );
}
