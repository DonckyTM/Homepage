"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lang, Localized, Project } from "@/lib/types";
import { EditableText } from "@/components/admin/EditableText";
import { EditableWrap } from "@/components/admin/EditableWrap";
import { EditableProjectField } from "@/components/admin/EditableProjectField";
import { EditableTechTags } from "@/components/admin/EditableTechTags";
import { EditableRepoUrl } from "@/components/admin/EditableRepoUrl";
import { safeExternalUrl } from "@/lib/safeUrl";
import { EditableScreenshot } from "@/components/admin/EditableScreenshot";
import { useEditMode } from "@/components/admin/EditContext";
import { updateProjectInline } from "@/app/admin/actions";
import { getScreenshotUrl } from "@/lib/supabase/storage";
import { SCREENSHOT_SIZES, screenshotLoader } from "@/lib/images";
import styles from "./ProjectModal.module.css";
import shared from "./shared.module.css";
import adminStyles from "@/components/admin/Editable.module.css";

interface ProjectModalProps {
  texts: Record<string, Localized>;
  projects: Project[];
  lang: Lang;
  openId: string | null;
  onClose: () => void;
}

export function ProjectModal({ texts: t, projects, lang, openId, onClose }: ProjectModalProps) {
  const editMode = useEditMode();
  const project = projects.find((p) => p.id === openId) ?? null;
  const shotUrl = project ? getScreenshotUrl(project.screenshotPath) : null;
  // repo_url is admin-editable and reaches an href, so re-check the scheme at
  // render time -- the column is also writable straight through PostgREST,
  // which never passes through the server action's validation.
  const safeRepoUrl = project ? safeExternalUrl(project.repoUrl) : null;

  return (
    <div
      className={`${styles.backdrop} ${project ? styles.backdropOpen : ""}`}
      onClick={onClose}
    >
      {project && (
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.shot}>
            {shotUrl && (
              <Image
                src={shotUrl}
                alt={project.title[lang]}
                fill
                loader={screenshotLoader}
                sizes={SCREENSHOT_SIZES}
                className={styles.shotImg}
                priority
                {...(project.screenshotBlur
                  ? { placeholder: "blur" as const, blurDataURL: project.screenshotBlur }
                  : {})}
              />
            )}
            {!shotUrl && <span className={styles.shotTag}>{project.screenshotLabel[lang]}</span>}
            {editMode && <EditableScreenshot projectId={project.id} />}
            <button className={styles.closeBtn} aria-label="Close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className={styles.body}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h3 style={{ margin: 0 }}>{project.title[lang]}</h3>
              {editMode && <InProgressToggle projectId={project.id} inProgress={project.inProgress} />}
            </div>

            <div className={styles.meta}>
              <div className={styles.metaCell}>
                <EditableText as="div" className={shared.eyebrow} textKey="modalYearLabel" value={t.modalYearLabel} lang={lang} />
                <EditableProjectField
                  as="div"
                  className={styles.metaVal}
                  value={project.year}
                  lang={lang}
                  label="Year"
                  onSave={(de, en) => updateProjectInline(project.id, { yearDe: de, yearEn: en })}
                />
              </div>
              <div className={`${styles.metaCell} ${styles.metaWide}`}>
                <EditableText as="div" className={shared.eyebrow} textKey="modalRoleLabel" value={t.modalRoleLabel} lang={lang} />
                <EditableProjectField
                  as="div"
                  className={styles.metaVal}
                  value={project.role}
                  lang={lang}
                  label="Role"
                  onSave={(de, en) => updateProjectInline(project.id, { roleDe: de, roleEn: en })}
                />
              </div>
            </div>

            <EditableProjectField
              as="p"
              value={project.long1}
              lang={lang}
              label="Text 1"
              multiline
              onSave={(de, en) => updateProjectInline(project.id, { long1De: de, long1En: en })}
            />
            <EditableProjectField
              as="p"
              className={styles.muted}
              value={project.long2}
              lang={lang}
              label="Text 2"
              multiline
              onSave={(de, en) => updateProjectInline(project.id, { long2De: de, long2En: en })}
            />

            <EditableText
              as="div"
              className={`${shared.eyebrow} ${styles.techLabel}`}
              textKey="modalTechLabel"
              value={t.modalTechLabel}
              lang={lang}
            />
            <EditableTechTags projectId={project.id} tags={project.techTags} />

            <div className={styles.actions}>
              <EditableRepoUrl projectId={project.id} repoUrl={project.repoUrl} isValid={safeRepoUrl !== null}>
                <EditableWrap textKey="modalRepo" value={t.modalRepo}>
                  <a href={safeRepoUrl ?? "#"} target="_blank" rel="noreferrer" className={styles.btnPrimary}>
                    {t.modalRepo[lang]}
                  </a>
                </EditableWrap>
              </EditableRepoUrl>
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

function InProgressToggle({ projectId, inProgress }: { projectId: string; inProgress: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function toggle() {
    startTransition(async () => {
      await updateProjectInline(projectId, { inProgress: !inProgress });
      router.refresh();
    });
  }

  return (
    <button type="button" onClick={toggle} disabled={pending} className={adminStyles.addTrigger}>
      {inProgress ? "✓ In progress" : "+ Mark in progress"}
    </button>
  );
}
