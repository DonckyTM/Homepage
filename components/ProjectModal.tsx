"use client";

import { Lang, Localized, Project } from "@/lib/types";
import styles from "./ProjectModal.module.css";
import shared from "./shared.module.css";

interface ProjectModalProps {
  texts: Record<string, Localized>;
  projects: Project[];
  lang: Lang;
  openId: string | null;
  onClose: () => void;
}

export function ProjectModal({ texts: t, projects, lang, openId, onClose }: ProjectModalProps) {
  const project = projects.find((p) => p.id === openId) ?? null;

  return (
    <div
      className={`${styles.backdrop} ${project ? styles.backdropOpen : ""}`}
      onClick={onClose}
    >
      {project && (
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.shot}>
            <span className={styles.shotTag}>{project.screenshotLabel[lang]}</span>
            <button className={styles.closeBtn} aria-label="Close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className={styles.body}>
            <h3>{project.title[lang]}</h3>

            <div className={styles.meta}>
              <div className={styles.metaCell}>
                <div className={shared.eyebrow}>{t.modalYearLabel[lang]}</div>
                <div className={styles.metaVal}>{project.year[lang]}</div>
              </div>
              <div className={`${styles.metaCell} ${styles.metaWide}`}>
                <div className={shared.eyebrow}>{t.modalRoleLabel[lang]}</div>
                <div className={styles.metaVal}>{project.role[lang]}</div>
              </div>
            </div>

            <p>{project.long1[lang]}</p>
            <p className={styles.muted}>{project.long2[lang]}</p>

            <div className={`${shared.eyebrow} ${styles.techLabel}`}>{t.modalTechLabel[lang]}</div>
            <div className={styles.tech}>
              {project.techTags.map((x) => (
                <span className={styles.techTag} key={x}>
                  {x}
                </span>
              ))}
            </div>

            <div className={styles.actions}>
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className={styles.btnPrimary}>
                  {t.modalRepo[lang]}
                </a>
              )}
              <button className={styles.btnOutline} onClick={onClose}>
                {t.modalClose[lang]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
