"use client";

import { Lang } from "@/lib/types";
import { siteTexts } from "@/lib/data/siteTexts";
import { projects } from "@/lib/data/projects";
import styles from "./ProjectsSection.module.css";

interface ProjectsSectionProps {
  lang: Lang;
  onOpenProject: (id: string) => void;
}

export function ProjectsSection({ lang, onOpenProject }: ProjectsSectionProps) {
  const t = siteTexts;
  const sorted = projects.slice().sort((a, b) => a.order - b.order);

  return (
    <section className={styles.section}>
      <h2>{t.projectsTitle[lang]}</h2>
      <p className={styles.intro}>{t.projectsIntro[lang]}</p>

      <div className={styles.grid}>
        {sorted.map((p, i) => (
          <button className={styles.card} key={p.id} onClick={() => onOpenProject(p.id)}>
            <div className={styles.shot}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.shotTag}>{p.screenshotLabel[lang]}</span>
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
        ))}
        <div className={styles.emptyCard}>
          <div className={styles.emptyTitle}>{t.emptyTitle[lang]}</div>
          <p className={styles.emptyBody}>{t.emptyBody[lang]}</p>
        </div>
      </div>
    </section>
  );
}
