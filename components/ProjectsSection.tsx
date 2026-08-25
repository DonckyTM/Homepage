"use client";

import Image from "next/image";
import { Lang, Localized, Project } from "@/lib/types";
import { EditableText } from "@/components/admin/EditableText";
import { EditableProjectCard, AddProjectCard } from "@/components/admin/EditableProjectCard";
import { useEditMode } from "@/components/admin/EditContext";
import { getScreenshotUrl } from "@/lib/supabase/storage";
import { SCREENSHOT_SIZES, screenshotLoader } from "@/lib/images";
import styles from "./ProjectsSection.module.css";

interface ProjectsSectionProps {
  texts: Record<string, Localized>;
  projects: Project[];
  lang: Lang;
  onOpenProject: (id: string) => void;
}

export function ProjectsSection({ texts: t, projects, lang, onOpenProject }: ProjectsSectionProps) {
  const editMode = useEditMode();
  const sorted = projects.slice().sort((a, b) => a.order - b.order);

  return (
    <section className={styles.section}>
      <EditableText as="h2" textKey="projectsTitle" value={t.projectsTitle} lang={lang} />
      <EditableText as="p" className={styles.intro} textKey="projectsIntro" value={t.projectsIntro} lang={lang} multiline />

      <div className={styles.grid}>
        {sorted.map((p, i) => {
          if (editMode) {
            return (
              <EditableProjectCard
                key={p.id}
                project={p}
                index={i}
                lang={lang}
                texts={t}
                isFirst={i === 0}
                isLast={i === sorted.length - 1}
                onOpenProject={onOpenProject}
              />
            );
          }

          const shotUrl = getScreenshotUrl(p.screenshotPath);

          return (
            <button className={styles.card} key={p.id} onClick={() => onOpenProject(p.id)}>
              <div className={styles.shot}>
                {shotUrl && (
                  <Image
                    src={shotUrl}
                    alt={p.title[lang]}
                    fill
                    loader={screenshotLoader}
                    sizes={SCREENSHOT_SIZES}
                    className={styles.shotImg}
                    // The tab only mounts on click, so lazy loading would delay
                    // the request until the card is already on screen.
                    priority
                    {...(p.screenshotBlur
                      ? { placeholder: "blur" as const, blurDataURL: p.screenshotBlur }
                      : {})}
                  />
                )}
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                {!shotUrl && <span className={styles.shotTag}>{p.screenshotLabel[lang]}</span>}
              </div>
              <div className={styles.body}>
                <div className={styles.head}>
                  <span className={styles.title}>{p.title[lang]}</span>
                  {p.inProgress && <span className={styles.badge}>{t.inProgress[lang]}</span>}
                </div>
                <p className={styles.blurb}>{p.blurb[lang]}</p>
                <span className={styles.cta}>{t.cardCta[lang]} →</span>
              </div>
            </button>
          );
        })}
        {editMode && <AddProjectCard />}
        <div className={styles.emptyCard}>
          <EditableText as="div" className={styles.emptyTitle} textKey="emptyTitle" value={t.emptyTitle} lang={lang} />
          <EditableText as="p" className={styles.emptyBody} textKey="emptyBody" value={t.emptyBody} lang={lang} multiline />
        </div>
      </div>
    </section>
  );
}
