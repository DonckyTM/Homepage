"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProjectInline } from "@/app/admin/actions";
import { useEditMode } from "./EditContext";
import { EditPopover } from "./EditPopover";
import styles from "./Editable.module.css";

interface EditableRepoUrlProps {
  projectId: string;
  repoUrl: string;
  children: React.ReactNode;
}

// Wraps the repo link/button. In edit mode it adds a pencil to change the
// URL, or an "add" trigger when there isn't one yet (in which case the
// children — the actual link — aren't rendered, mirroring the read view).
export function EditableRepoUrl({ projectId, repoUrl, children }: EditableRepoUrlProps) {
  const editMode = useEditMode();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(repoUrl);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!editMode) {
    return repoUrl ? <>{children}</> : null;
  }

  function startEdit() {
    setValue(repoUrl);
    setEditing(true);
  }

  function save() {
    startTransition(async () => {
      await updateProjectInline(projectId, { repoUrl: value.trim() });
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <span className={styles.editHost} style={{ display: "inline-flex", alignItems: "center", position: "relative" }}>
      {repoUrl ? (
        <>
          {children}
          <button type="button" className={styles.pencil} aria-label="Edit repo link" onClick={startEdit}>
            ✎
          </button>
        </>
      ) : (
        <button type="button" className={styles.addTrigger} onClick={startEdit}>
          + Add repo link
        </button>
      )}
      {editing && (
        <EditPopover
          fields={[{ label: "Repo URL", value, onChange: setValue }]}
          onSave={save}
          onCancel={() => setEditing(false)}
          pending={pending}
        />
      )}
    </span>
  );
}
