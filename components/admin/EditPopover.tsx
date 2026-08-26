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

  // The popover opens below its trigger, which can push most of it past the
  // bottom of the viewport (e.g. editing the last item in a list). Center it
  // as soon as it mounts so it's actually on screen; Save/Cancel themselves
  // are pinned to the popover's own bottom edge (see .popoverActions) so they
  // stay reachable even if the popover itself still needs to scroll.
  useEffect(() => {
    // "smooth" here is unreliable: two mount-effect passes in a row (e.g.
    // React's dev Strict Mode double-invoke) can cancel a smooth scroll
    // mid-animation and leave it wherever it happened to stop, so use an
    // instant jump instead.
    ref.current?.scrollIntoView({ block: "center", behavior: "instant" });
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
            />
          ) : (
            <input value={field.value} onChange={(event) => field.onChange(event.target.value)} />
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
