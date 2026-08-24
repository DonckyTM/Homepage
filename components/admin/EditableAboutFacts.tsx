"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createAboutFactInline,
  deleteAboutFactInline,
  moveAboutFactInline,
  updateAboutFactInline
} from "@/app/admin/actions";
import { AboutFact, Lang } from "@/lib/types";
import { useEditMode } from "./EditContext";
import { EditPopover } from "./EditPopover";
import aboutStyles from "@/components/AboutSection.module.css";
import styles from "./Editable.module.css";

interface EditableAboutFactsProps {
  facts: AboutFact[];
  lang: Lang;
}

export function EditableAboutFacts({ facts, lang }: EditableAboutFactsProps) {
  const editMode = useEditMode();
  const sorted = facts.slice().sort((a, b) => a.order - b.order);

  if (!editMode) {
    return (
      <div className={aboutStyles.aboutRows}>
        {sorted.map((row) => (
          <div className={aboutStyles.aboutRow} key={row.id}>
            <span className={aboutStyles.aboutRowK}>{row.label[lang]}</span>
            <span className={aboutStyles.aboutRowV}>{row.value[lang]}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={aboutStyles.aboutRows}>
      {sorted.map((row, index) => (
        <FactRow key={row.id} fact={row} lang={lang} isFirst={index === 0} isLast={index === sorted.length - 1} />
      ))}
      <AddFactRow />
    </div>
  );
}

function FactRow({
  fact,
  lang,
  isFirst,
  isLast
}: {
  fact: AboutFact;
  lang: Lang;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [labelDe, setLabelDe] = useState(fact.label.de);
  const [labelEn, setLabelEn] = useState(fact.label.en);
  const [valueDe, setValueDe] = useState(fact.value.de);
  const [valueEn, setValueEn] = useState(fact.value.en);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function startEdit() {
    setLabelDe(fact.label.de);
    setLabelEn(fact.label.en);
    setValueDe(fact.value.de);
    setValueEn(fact.value.en);
    setEditing(true);
  }

  function save() {
    startTransition(async () => {
      await updateAboutFactInline(fact.id, labelDe, labelEn, valueDe, valueEn);
      setEditing(false);
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await deleteAboutFactInline(fact.id);
      router.refresh();
    });
  }

  function move(direction: "up" | "down") {
    startTransition(async () => {
      await moveAboutFactInline(fact.id, direction);
      router.refresh();
    });
  }

  return (
    <div className={`${aboutStyles.aboutRow} ${styles.listItem}`}>
      <span style={{ display: "flex", justifyContent: "space-between", gap: 16, flex: 1 }}>
        <span className={aboutStyles.aboutRowK}>{fact.label[lang]}</span>
        <span className={aboutStyles.aboutRowV}>{fact.value[lang]}</span>
      </span>
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
            { label: "Label (DE)", value: labelDe, onChange: setLabelDe },
            { label: "Label (EN)", value: labelEn, onChange: setLabelEn },
            { label: "Value (DE)", value: valueDe, onChange: setValueDe },
            { label: "Value (EN)", value: valueEn, onChange: setValueEn }
          ]}
          onSave={save}
          onCancel={() => setEditing(false)}
          pending={pending}
        />
      )}
    </div>
  );
}

function AddFactRow() {
  const [open, setOpen] = useState(false);
  const [labelDe, setLabelDe] = useState("");
  const [labelEn, setLabelEn] = useState("");
  const [valueDe, setValueDe] = useState("");
  const [valueEn, setValueEn] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function save() {
    startTransition(async () => {
      await createAboutFactInline(labelDe, labelEn, valueDe, valueEn);
      setLabelDe("");
      setLabelEn("");
      setValueDe("");
      setValueEn("");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div className={aboutStyles.aboutRow} style={{ justifyContent: "flex-start" }}>
      <span className={styles.addWrap}>
        <button type="button" className={styles.addTrigger} onClick={() => setOpen(true)}>
          + Add fact
        </button>
        {open && (
          <EditPopover
            fields={[
              { label: "Label (DE)", value: labelDe, onChange: setLabelDe },
              { label: "Label (EN)", value: labelEn, onChange: setLabelEn },
              { label: "Value (DE)", value: valueDe, onChange: setValueDe },
              { label: "Value (EN)", value: valueEn, onChange: setValueEn }
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
