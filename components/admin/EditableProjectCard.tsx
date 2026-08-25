"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createProjectInline,
  deleteProjectInline,
  moveProjectInline,
  updateProjectInline
} from "@/app/admin/actions";
import { Lang, Localized, Project } from "@/lib/types";
import { EditPopover } from "./EditPopover";
import { getScreenshotUrl } from "@/lib/supabase/storage";
import { SCREENSHOT_SIZES, screenshotLoader } from "@/lib/images";
import projectStyles from "@/components/ProjectsSection.module.css";
import styles from "./Editable.module.css";

interface EditableProjectCardProps {
  project: Project;
  index: number;
  lang: Lang;
  texts: Record<string, Localized>;
  isFirst: boolean;
  isLast: boolean;
  onOpenProject: (id: string) => void;
}

export function EditableProjectCard({
  project,
  index,
  lang,
  texts: t,
  isFirst,
  isLast,
  onOpenProject
}: EditableProjectCardProps) {
  const [editing, setEditing] = useState(false);
  const [titleDe, setTitleDe] = useState(project.title.de);
  const [titleEn, setTitleEn] = useState(project.title.en);
  const [blurbDe, setBlurbDe] = useState(project.blurb.de);
  const [blurbEn, setBlurbEn] = useState(project.blurb.en);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const shotUrl = getScreenshotUrl(project.screenshotPath);

  function startEdit() {
    setTitleDe(project.title.de);
    setTitleEn(project.title.en);
    setBlurbDe(project.blurb.de);
    setBlurbEn(project.blurb.en);
    setEditing(true);
  }

  function save() {
    startTransition(async () => {
      await updateProjectInline(project.id, { titleDe, titleEn, blurbDe, blurbEn });
      setEditing(false);
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await deleteProjectInline(project.id);
      router.refresh();
    });
  }

  function move(direction: "up" | "down") {
    startTransition(async () => {
      await moveProjectInline(project.id, direction);
      router.refresh();
    });
  }

  return (
    <div className={`${projectStyles.card} ${styles.listItem}`}>
      <button type="button" className={projectStyles.cardTrigger} onClick={() => onOpenProject(project.id)}>
        <div className={projectStyles.shot}>
          {shotUrl && (
            <Image
              src={shotUrl}
              alt={project.title[lang]}
              fill
              loader={screenshotLoader}
              sizes={SCREENSHOT_SIZES}
              className={projectStyles.shotImg}
              priority
              {...(project.screenshotBlur
                ? { placeholder: "blur" as const, blurDataURL: project.screenshotBlur }
                : {})}
            />
          )}
          <span className={projectStyles.num}>{String(index + 1).padStart(2, "0")}</span>
          {!shotUrl && <span className={projectStyles.shotTag}>{project.screenshotLabel[lang]}</span>}
        </div>
        <div className={projectStyles.body}>
          <div className={projectStyles.head}>
            <span className={projectStyles.title}>{project.title[lang]}</span>
            {project.inProgress && <span className={projectStyles.badge}>{t.inProgress[lang]}</span>}
          </div>
          <p className={projectStyles.blurb}>{project.blurb[lang]}</p>
          <span className={projectStyles.cta}>{t.cardCta[lang]} →</span>
        </div>
      </button>
      <span className={projectStyles.cardControls}>
        <button type="button" className={styles.iconBtn} onClick={() => move("up")} disabled={isFirst || pending} aria-label="Move up">
          ↑
        </button>
        <button type="button" className={styles.iconBtn} onClick={() => move("down")} disabled={isLast || pending} aria-label="Move down">
          ↓
        </button>
        <button type="button" className={styles.iconBtn} onClick={startEdit} disabled={pending} aria-label="Edit">
          ✎
        </button>
        <button
          type="button"
          className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
          onClick={remove}
          disabled={pending}
          aria-label="Delete"
        >
          ✕
        </button>
      </span>
      {editing && (
        <EditPopover
          fields={[
            { label: "Title (DE)", value: titleDe, onChange: setTitleDe },
            { label: "Title (EN)", value: titleEn, onChange: setTitleEn },
            { label: "Blurb (DE)", value: blurbDe, onChange: setBlurbDe, multiline: true },
            { label: "Blurb (EN)", value: blurbEn, onChange: setBlurbEn, multiline: true }
          ]}
          onSave={save}
          onCancel={() => setEditing(false)}
          pending={pending}
        />
      )}
    </div>
  );
}

export function AddProjectCard() {
  const [open, setOpen] = useState(false);
  const [titleDe, setTitleDe] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [blurbDe, setBlurbDe] = useState("");
  const [blurbEn, setBlurbEn] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function save() {
    startTransition(async () => {
      await createProjectInline(titleDe, titleEn, blurbDe, blurbEn);
      setTitleDe("");
      setTitleEn("");
      setBlurbDe("");
      setBlurbEn("");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div className={projectStyles.emptyCard} style={{ position: "relative" }}>
      <span className={styles.addWrap}>
        <button type="button" className={styles.addTrigger} onClick={() => setOpen(true)}>
          + Add project
        </button>
        {open && (
          <EditPopover
            fields={[
              { label: "Title (DE)", value: titleDe, onChange: setTitleDe },
              { label: "Title (EN)", value: titleEn, onChange: setTitleEn },
              { label: "Blurb (DE)", value: blurbDe, onChange: setBlurbDe, multiline: true },
              { label: "Blurb (EN)", value: blurbEn, onChange: setBlurbEn, multiline: true }
            ]}
            onSave={save}
            onCancel={() => setOpen(false)}
            pending={pending}
            saveLabel="Add"
          />
        )}
      </span>
    </div>
  );
}
