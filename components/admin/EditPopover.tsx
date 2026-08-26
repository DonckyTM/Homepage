"use client";

import { useEffect, useRef } from "react";
import styles from "./Editable.module.css";

interface Field {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

interface EditPopoverProps {
  fields: Field[];
  onSave: () => void;
  onCancel: () => void;
  pending: boolean;
  saveLabel?: string;
}

export function EditPopover({ fields, onSave, onCancel, pending, saveLabel }: EditPopoverProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // The popover opens below its trigger, which can push the Save/Cancel
  // buttons past the bottom of the viewport (e.g. editing the last item in a
  // list, or on a short mobile screen) with no way to scroll them into view.
  // Center it in the viewport as soon as it mounts so it's always reachable.
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);

  return (
    <span ref={ref} className={styles.popover} onClick={(event) => event.stopPropagation()}>
      {fields.map((field, index) => (
        <label className={styles.popoverField} key={index}>
          <span>{field.label}</span>
          {field.multiline ? (
            <textarea
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
              rows={3}
              autoFocus={index === 0}
            />
          ) : (
            <input
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
              autoFocus={index === 0}
            />
          )}
        </label>
      ))}
      <span className={styles.popoverActions}>
        <button type="button" className={styles.popoverCancel} onClick={onCancel} disabled={pending}>
          Cancel
        </button>
        <button type="button" className={styles.popoverSave} onClick={onSave} disabled={pending}>
          {pending ? "Saving…" : (saveLabel ?? "Save")}
        </button>
      </span>
    </span>
  );
}
