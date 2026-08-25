"use client";

import { useEffect } from "react";
import { AboutFact, HomeFact, Localized, Milestone, Project, StackTag, TabDef } from "@/lib/types";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";
import { Header } from "@/components/Header";
import { HomeSection } from "@/components/HomeSection";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { CurrentSection } from "@/components/CurrentSection";
import { ProjectModal } from "@/components/ProjectModal";
import { ContactModal } from "@/components/ContactModal";
import { Footer } from "@/components/Footer";
import { useSiteState } from "@/lib/useSiteState";
import { EditModeProvider } from "@/components/admin/EditContext";
import styles from "@/app/page.module.css";

interface SiteShellProps {
  siteTexts: Record<string, Localized>;
  homeFacts: HomeFact[];
  aboutFacts: AboutFact[];
  stack: StackTag[];
  projects: Project[];
  milestones: Milestone[];
  tabs: TabDef[];
  brandLogoUrl: string | null;
  editable?: boolean;
}

export function SiteShell({
  siteTexts,
  homeFacts,
  aboutFacts,
  stack,
  projects,
  milestones,
  tabs,
  brandLogoUrl,
  editable = false
}: SiteShellProps) {
  const {
    tab,
    goTab,
    lang,
    toggleLang,
    theme,
    toggleTheme,
    openId,
    openModal,
    closeModal,
    contactOpen,
    openContact,
    closeContact
  } = useSiteState();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <EditModeProvider enabled={editable}>
      <div id="app" data-theme={theme}>
        <BackgroundOrbs />

        <Header
          tabs={tabs}
          tab={tab}
          lang={lang}
          theme={theme}
          brandName={siteTexts.brandName}
          brandLogoUrl={brandLogoUrl}
          onTabChange={goTab}
          onToggleLang={toggleLang}
          onToggleTheme={toggleTheme}
        />

        <main className={styles.main}>
          {tab === "home" && (
            <HomeSection
              texts={siteTexts}
              facts={homeFacts}
              lang={lang}
              onGoCurrent={() => goTab("current")}
              onOpenContact={openContact}
            />
          )}
          {tab === "about" && <AboutSection texts={siteTexts} facts={aboutFacts} stack={stack} lang={lang} />}
          {tab === "projects" && (
            <ProjectsSection texts={siteTexts} projects={projects} lang={lang} onOpenProject={openModal} />
          )}
          {tab === "current" && <CurrentSection texts={siteTexts} milestones={milestones} lang={lang} />}
        </main>

        <ProjectModal texts={siteTexts} projects={projects} lang={lang} openId={openId} onClose={closeModal} />
        <ContactModal texts={siteTexts} lang={lang} open={contactOpen} onClose={closeContact} />

        <Footer />
      </div>
    </EditModeProvider>
  );
}
