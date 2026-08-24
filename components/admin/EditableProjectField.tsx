"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lang, Localized } from "@/lib/types";
import { useEditMode } from "./EditContext";
import { EditPopover } from "./EditPopover";
import styles from "./Editable.module.css";

interface EditableProjectFieldProps {
  value: Localized;
  lang: Lang;
  label: string;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
  className?: string;
  multiline?: boolean;
  onSave: (de: string, en: string) => Promise<void>;
}

// Like EditableText, but for per-project fields (role, year, long1/long2)
// that go through updateProjectInline rather than updateSiteTextInline.
export function EditableProjectField({
  value,
  lang,
  label,
  as: Tag = "span",
  className,
  multiline,
  onSave
}: EditableProjectFieldProps) {
  const editMode = useEditMode();
  const [editing, setEditing] = useState(false);
  const [de, setDe] = useState(value.de);
  const [en, setEn] = useState(value.en);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!editMode) {
    return <Tag className={className}>{value[lang]}</Tag>;
  }

  function startEdit() {
    setDe(value.de);
    setEn(value.en);
    setEditing(true);
  }

  function save() {
    startTransition(async () => {
      await onSave(de, en);
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <Tag className={`${className ?? ""} ${styles.editHost}`}>
      {value[lang]}
      <button type="button" className={styles.pencil} aria-label={`Edit ${label}`} onClick={startEdit}>
        ✎
      </button>
      {editing && (
        <EditPopover
          fields={[
            { label: `${label} (DE)`, value: de, onChange: setDe, multiline },
            { label: `${label} (EN)`, value: en, onChange: setEn, multiline }
          ]}
          onSave={save}
          onCancel={() => setEditing(false)}
          pending={pending}
        />
      )}
    </Tag>
  );
}
