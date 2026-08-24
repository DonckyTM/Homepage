"use client";

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
  return (
    <span className={styles.popover} onClick={(event) => event.stopPropagation()}>
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
