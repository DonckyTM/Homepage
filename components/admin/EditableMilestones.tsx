"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createMilestoneInline,
  deleteMilestoneInline,
  moveMilestoneInline,
  toggleMilestoneDoneInline,
  updateMilestoneInline
} from "@/app/admin/actions";
import { Lang, Milestone } from "@/lib/types";
import { useEditMode } from "./EditContext";
import { EditPopover } from "./EditPopover";
import currentStyles from "@/components/CurrentSection.module.css";
import styles from "./Editable.module.css";

interface EditableMilestonesProps {
  milestones: Milestone[];
  lang: Lang;
}

export function EditableMilestones({ milestones, lang }: EditableMilestonesProps) {
  const editMode = useEditMode();
  const sorted = milestones.slice().sort((a, b) => a.order - b.order);

  if (!editMode) {
    return (
      <div className={currentStyles.milestones}>
        {sorted.map((m) => (
          <div className={`${currentStyles.milestone} ${m.done ? currentStyles.milestoneDone : ""}`} key={m.id}>
            <div className={currentStyles.dot}>{m.done ? "✓" : ""}</div>
            <div className={currentStyles.milestoneBody}>
              <div className={currentStyles.milestoneTitle}>{m.title[lang]}</div>
              <div className={currentStyles.note}>{m.note[lang]}</div>
            </div>
            <div className={currentStyles.date}>{m.date[lang]}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={currentStyles.milestones}>
      {sorted.map((m, index) => (
        <MilestoneRow key={m.id} milestone={m} lang={lang} isFirst={index === 0} isLast={index === sorted.length - 1} />
      ))}
      <AddMilestoneRow />
    </div>
  );
}

function MilestoneRow({
  milestone,
  lang,
  isFirst,
  isLast
}: {
  milestone: Milestone;
  lang: Lang;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [titleDe, setTitleDe] = useState(milestone.title.de);
  const [titleEn, setTitleEn] = useState(milestone.title.en);
  const [noteDe, setNoteDe] = useState(milestone.note.de);
  const [noteEn, setNoteEn] = useState(milestone.note.en);
  const [dateDe, setDateDe] = useState(milestone.date.de);
  const [dateEn, setDateEn] = useState(milestone.date.en);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function toggleDone() {
    startTransition(async () => {
      await toggleMilestoneDoneInline(milestone.id, !milestone.done);
      router.refresh();
    });
  }

  function startEdit() {
    setTitleDe(milestone.title.de);
    setTitleEn(milestone.title.en);
    setNoteDe(milestone.note.de);
    setNoteEn(milestone.note.en);
    setDateDe(milestone.date.de);
    setDateEn(milestone.date.en);
    setEditing(true);
  }

  function save() {
    startTransition(async () => {
      await updateMilestoneInline(milestone.id, titleDe, titleEn, noteDe, noteEn, dateDe, dateEn);
      setEditing(false);
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await deleteMilestoneInline(milestone.id);
      router.refresh();
    });
  }

  function move(direction: "up" | "down") {
    startTransition(async () => {
      await moveMilestoneInline(milestone.id, direction);
      router.refresh();
    });
  }

  return (
    <div className={`${currentStyles.milestone} ${milestone.done ? currentStyles.milestoneDone : ""} ${styles.listItem}`}>
      <button
        type="button"
        className={currentStyles.dot}
        onClick={toggleDone}
        disabled={pending}
        aria-label={milestone.done ? "Mark as not done" : "Mark as done"}
        style={{ appearance: "none", padding: 0, font: "inherit", cursor: pending ? "default" : "pointer" }}
      >
        {milestone.done ? "✓" : ""}
      </button>
      <div className={currentStyles.milestoneBody}>
        <div className={currentStyles.milestoneTitle}>{milestone.title[lang]}</div>
        <div className={currentStyles.note}>{milestone.note[lang]}</div>
      </div>
      <div className={currentStyles.date}>{milestone.date[lang]}</div>
      <span className={styles.itemControls}>
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
            { label: "Note (DE)", value: noteDe, onChange: setNoteDe, multiline: true },
            { label: "Note (EN)", value: noteEn, onChange: setNoteEn, multiline: true },
            { label: "Date (DE)", value: dateDe, onChange: setDateDe },
            { label: "Date (EN)", value: dateEn, onChange: setDateEn }
          ]}
          onSave={save}
          onCancel={() => setEditing(false)}
          pending={pending}
        />
      )}
    </div>
  );
}

function AddMilestoneRow() {
  const [open, setOpen] = useState(false);
  const [titleDe, setTitleDe] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [noteDe, setNoteDe] = useState("");
  const [noteEn, setNoteEn] = useState("");
  const [dateDe, setDateDe] = useState("open");
  const [dateEn, setDateEn] = useState("open");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function save() {
    startTransition(async () => {
      await createMilestoneInline(titleDe, titleEn, noteDe, noteEn, dateDe, dateEn);
      setTitleDe("");
      setTitleEn("");
      setNoteDe("");
      setNoteEn("");
      setDateDe("open");
      setDateEn("open");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div className={currentStyles.milestone} style={{ position: "relative" }}>
      <span className={styles.addWrap}>
        <button type="button" className={styles.addTrigger} onClick={() => setOpen(true)}>
          + Add milestone
        </button>
        {open && (
          <EditPopover
            fields={[
              { label: "Title (DE)", value: titleDe, onChange: setTitleDe },
              { label: "Title (EN)", value: titleEn, onChange: setTitleEn },
              { label: "Note (DE)", value: noteDe, onChange: setNoteDe, multiline: true },
              { label: "Note (EN)", value: noteEn, onChange: setNoteEn, multiline: true },
              { label: "Date (DE)", value: dateDe, onChange: setDateDe },
              { label: "Date (EN)", value: dateEn, onChange: setDateEn }
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
