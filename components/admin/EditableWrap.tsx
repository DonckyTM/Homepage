"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSiteTextInline } from "@/app/admin/actions";
import { Localized } from "@/lib/types";
import { useEditMode } from "./EditContext";
import { EditPopover } from "./EditPopover";
import styles from "./Editable.module.css";

interface EditableWrapProps {
  textKey: string;
  value: Localized;
  children: React.ReactNode;
}

// For text that lives inside an existing interactive element (a link or a
// button, e.g. a CTA label) — the pencil sits next to it as a sibling
// instead of nesting inside it, since interactive elements can't nest.
export function EditableWrap({ textKey, value, children }: EditableWrapProps) {
  const editMode = useEditMode();
  const [editing, setEditing] = useState(false);
  const [de, setDe] = useState(value.de);
  const [en, setEn] = useState(value.en);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!editMode) {
    return <>{children}</>;
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
    <span className={styles.editHost} style={{ display: "inline-flex", alignItems: "center" }}>
      {children}
      <button type="button" className={styles.pencil} aria-label={`Edit "${textKey}"`} onClick={startEdit}>
        ✎
      </button>
      {editing && (
        <EditPopover
          fields={[
            { label: "DE", value: de, onChange: setDe },
            { label: "EN", value: en, onChange: setEn }
          ]}
          onSave={save}
          onCancel={() => setEditing(false)}
          pending={pending}
        />
      )}
    </span>
  );
}
