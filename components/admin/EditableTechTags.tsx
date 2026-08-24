"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProjectInline } from "@/app/admin/actions";
import { useEditMode } from "./EditContext";
import { EditPopover } from "./EditPopover";
import modalStyles from "@/components/ProjectModal.module.css";
import styles from "./Editable.module.css";

interface EditableTechTagsProps {
  projectId: string;
  tags: string[];
}

export function EditableTechTags({ projectId, tags }: EditableTechTagsProps) {
  const editMode = useEditMode();
  const [pending, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const router = useRouter();

  if (!editMode) {
    return (
      <div className={modalStyles.tech}>
        {tags.map((x) => (
          <span className={modalStyles.techTag} key={x}>
            {x}
          </span>
        ))}
      </div>
    );
  }

  function removeTag(tag: string) {
    startTransition(async () => {
      await updateProjectInline(projectId, { techTags: tags.filter((x) => x !== tag) });
      router.refresh();
    });
  }

  function addTag() {
    const trimmed = newTag.trim();
    if (!trimmed) {
      setAddOpen(false);
      return;
    }
    startTransition(async () => {
      await updateProjectInline(projectId, { techTags: [...tags, trimmed] });
      setNewTag("");
      setAddOpen(false);
      router.refresh();
    });
  }

  return (
    <div className={modalStyles.tech}>
      {tags.map((x) => (
        <span className={modalStyles.techTag} key={x} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {x}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => removeTag(x)}
            disabled={pending}
            aria-label={`Remove ${x}`}
          >
            ✕
          </button>
        </span>
      ))}
      <span className={styles.addWrap}>
        <button type="button" className={styles.addTrigger} onClick={() => setAddOpen(true)} disabled={pending}>
          + Add tag
        </button>
        {addOpen && (
          <EditPopover
            fields={[{ label: "Tag", value: newTag, onChange: setNewTag }]}
            onSave={addTag}
            onCancel={() => setAddOpen(false)}
            pending={pending}
            saveLabel="Add"
          />
        )}
      </span>
    </div>
  );
}
