"use client";

import { BackgroundOrbs } from "@/components/BackgroundOrbs";
import { Header } from "@/components/Header";
import { HomeSection } from "@/components/HomeSection";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { CurrentSection } from "@/components/CurrentSection";
import { ProjectModal } from "@/components/ProjectModal";
import { Footer } from "@/components/Footer";
import { useSiteState } from "@/lib/useSiteState";
import styles from "./page.module.css";

export default function Page() {
  const { tab, goTab, lang, toggleLang, theme, toggleTheme, openId, openModal, closeModal } = useSiteState();

  return (
    <div id="app" data-theme={theme}>
      <BackgroundOrbs />

      <Header
        tab={tab}
        lang={lang}
        theme={theme}
        onTabChange={goTab}
        onToggleLang={toggleLang}
        onToggleTheme={toggleTheme}
      />

      <main className={styles.main}>
        {tab === "home" && <HomeSection lang={lang} onGoCurrent={() => goTab("current")} />}
        {tab === "about" && <AboutSection lang={lang} />}
        {tab === "projects" && <ProjectsSection lang={lang} onOpenProject={openModal} />}
        {tab === "current" && <CurrentSection lang={lang} />}
      </main>

      <ProjectModal lang={lang} openId={openId} onClose={closeModal} />

      <Footer />
    </div>
  );
}
