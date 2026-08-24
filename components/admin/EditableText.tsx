"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSiteTextInline } from "@/app/admin/actions";
import { Lang, Localized } from "@/lib/types";
import { useEditMode } from "./EditContext";
import { EditPopover } from "./EditPopover";
import styles from "./Editable.module.css";

interface EditableTextProps {
  textKey: string;
  value: Localized;
  lang: Lang;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
  className?: string;
  multiline?: boolean;
}

export function EditableText({ textKey, value, lang, as: Tag = "span", className, multiline }: EditableTextProps) {
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
      await updateSiteTextInline(textKey, de, en);
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <Tag className={`${className ?? ""} ${styles.editHost}`}>
      {value[lang]}
      <button type="button" className={styles.pencil} aria-label={`Edit "${textKey}"`} onClick={startEdit}>
        ✎
      </button>
      {editing && (
        <EditPopover
          fields={[
            { label: "DE", value: de, onChange: setDe, multiline },
            { label: "EN", value: en, onChange: setEn, multiline }
          ]}
          onSave={save}
          onCancel={() => setEditing(false)}
          pending={pending}
        />
      )}
    </Tag>
  );
}
