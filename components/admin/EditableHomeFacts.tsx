"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createHomeFactInline,
  deleteHomeFactInline,
  moveHomeFactInline,
  updateHomeFactInline
} from "@/app/admin/actions";
import { HomeFact, Lang } from "@/lib/types";
import { useEditMode } from "./EditContext";
import { EditPopover } from "./EditPopover";
import homeStyles from "@/components/HomeSection.module.css";
import shared from "@/components/shared.module.css";
import styles from "./Editable.module.css";

interface EditableHomeFactsProps {
  facts: HomeFact[];
  lang: Lang;
}

export function EditableHomeFacts({ facts, lang }: EditableHomeFactsProps) {
  const editMode = useEditMode();
  const sorted = facts.slice().sort((a, b) => a.order - b.order);

  if (!editMode) {
    return (
      <div className={homeStyles.facts}>
        {sorted.map((f) => (
          <div className={homeStyles.factCard} key={f.id}>
            <div className={shared.eyebrow}>{f.label[lang]}</div>
            <div className={homeStyles.factVal}>{f.value[lang]}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={homeStyles.facts}>
      {sorted.map((f, index) => (
        <HomeFactCard key={f.id} fact={f} lang={lang} isFirst={index === 0} isLast={index === sorted.length - 1} />
      ))}
      <AddHomeFactCard />
    </div>
  );
}

function HomeFactCard({
  fact,
  lang,
  isFirst,
  isLast
}: {
  fact: HomeFact;
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
      await updateHomeFactInline(fact.id, labelDe, labelEn, valueDe, valueEn);
      setEditing(false);
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await deleteHomeFactInline(fact.id);
      router.refresh();
    });
  }

  function move(direction: "up" | "down") {
    startTransition(async () => {
      await moveHomeFactInline(fact.id, direction);
      router.refresh();
    });
  }

  return (
    <div className={`${homeStyles.factCard} ${styles.listItem}`}>
      <div className={shared.eyebrow}>{fact.label[lang]}</div>
      <div className={homeStyles.factVal}>{fact.value[lang]}</div>
      <span className={styles.itemControls} style={{ position: "absolute", top: 12, right: 12 }}>
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

function AddHomeFactCard() {
  const [open, setOpen] = useState(false);
  const [labelDe, setLabelDe] = useState("");
  const [labelEn, setLabelEn] = useState("");
  const [valueDe, setValueDe] = useState("");
  const [valueEn, setValueEn] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function save() {
    startTransition(async () => {
      await createHomeFactInline(labelDe, labelEn, valueDe, valueEn);
      setLabelDe("");
      setLabelEn("");
      setValueDe("");
      setValueEn("");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div
      className={homeStyles.factCard}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
    >
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
    </div>
  );
}
