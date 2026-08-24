"use client";

import { Lang, Localized, Project } from "@/lib/types";
import { EditableText } from "@/components/admin/EditableText";
import { EditableWrap } from "@/components/admin/EditableWrap";
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
                <EditableText as="div" className={shared.eyebrow} textKey="modalYearLabel" value={t.modalYearLabel} lang={lang} />
                <div className={styles.metaVal}>{project.year[lang]}</div>
              </div>
              <div className={`${styles.metaCell} ${styles.metaWide}`}>
                <EditableText as="div" className={shared.eyebrow} textKey="modalRoleLabel" value={t.modalRoleLabel} lang={lang} />
                <div className={styles.metaVal}>{project.role[lang]}</div>
              </div>
            </div>

            <p>{project.long1[lang]}</p>
            <p className={styles.muted}>{project.long2[lang]}</p>

            <EditableText
              as="div"
              className={`${shared.eyebrow} ${styles.techLabel}`}
              textKey="modalTechLabel"
              value={t.modalTechLabel}
              lang={lang}
            />
            <div className={styles.tech}>
              {project.techTags.map((x) => (
                <span className={styles.techTag} key={x}>
                  {x}
                </span>
              ))}
            </div>

            <div className={styles.actions}>
              {project.repoUrl && (
                <EditableWrap textKey="modalRepo" value={t.modalRepo}>
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className={styles.btnPrimary}>
                    {t.modalRepo[lang]}
                  </a>
                </EditableWrap>
              )}
              <EditableWrap textKey="modalClose" value={t.modalClose}>
                <button className={styles.btnOutline} onClick={onClose}>
                  {t.modalClose[lang]}
                </button>
              </EditableWrap>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
