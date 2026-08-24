"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createStackTagInline,
  deleteStackTagInline,
  moveStackTagInline,
  updateStackTagInline
} from "@/app/admin/actions";
import { StackTag } from "@/lib/types";
import { useEditMode } from "./EditContext";
import { EditPopover } from "./EditPopover";
import aboutStyles from "@/components/AboutSection.module.css";
import styles from "./Editable.module.css";

interface EditableStackTagsProps {
  tags: StackTag[];
}

export function EditableStackTags({ tags }: EditableStackTagsProps) {
  const editMode = useEditMode();
  const sorted = tags.slice().sort((a, b) => a.order - b.order);

  if (!editMode) {
    return (
      <div className={aboutStyles.stackTags}>
        {sorted.map((tag) => (
          <span className={aboutStyles.stackTag} key={tag.id}>
            {tag.name}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={aboutStyles.stackTags}>
      {sorted.map((tag, index) => (
        <StackTagItem key={tag.id} tag={tag} isFirst={index === 0} isLast={index === sorted.length - 1} />
      ))}
      <AddStackTag />
    </div>
  );
}

function StackTagItem({ tag, isFirst, isLast }: { tag: StackTag; isFirst: boolean; isLast: boolean }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(tag.name);
  const [icon, setIcon] = useState(tag.icon ?? "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function startEdit() {
    setName(tag.name);
    setIcon(tag.icon ?? "");
    setEditing(true);
  }

  function save() {
    startTransition(async () => {
      await updateStackTagInline(tag.id, name, icon);
      setEditing(false);
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await deleteStackTagInline(tag.id);
      router.refresh();
    });
  }

  function move(direction: "up" | "down") {
    startTransition(async () => {
      await moveStackTagInline(tag.id, direction);
      router.refresh();
    });
  }

  return (
    <span className={`${aboutStyles.stackTag} ${styles.listItem}`}>
      {tag.name}
      <span className={styles.itemControls}>
        <button type="button" className={styles.iconBtn} onClick={() => move("up")} disabled={isFirst || pending} aria-label="Move earlier">
          ↑
        </button>
        <button type="button" className={styles.iconBtn} onClick={() => move("down")} disabled={isLast || pending} aria-label="Move later">
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
            { label: "Name", value: name, onChange: setName },
            { label: "Icon (optional)", value: icon, onChange: setIcon }
          ]}
          onSave={save}
          onCancel={() => setEditing(false)}
          pending={pending}
        />
      )}
    </span>
  );
}

function AddStackTag() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function save() {
    startTransition(async () => {
      await createStackTagInline(name, icon);
      setName("");
      setIcon("");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <span className={styles.addWrap}>
      <button type="button" className={styles.addTrigger} onClick={() => setOpen(true)}>
        + Add tag
      </button>
      {open && (
        <EditPopover
          fields={[
            { label: "Name", value: name, onChange: setName },
            { label: "Icon (optional)", value: icon, onChange: setIcon }
          ]}
          onSave={save}
          onCancel={() => setOpen(false)}
          pending={pending}
          saveLabel="Add"
        />
      )}
    </span>
  );
}
