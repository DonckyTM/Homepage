"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadBrandLogoInline } from "@/app/admin/actions";
import { useEditMode } from "./EditContext";
import styles from "./Editable.module.css";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 2 * 1024 * 1024;

export function EditableBrandLogo() {
  const editMode = useEditMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!editMode) {
    return null;
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only PNG, JPEG, or WebP images are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be 2MB or smaller.");
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      try {
        await uploadBrandLogoInline(formData);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    });
  }

  return (
    <span className={styles.editHost} style={{ position: "absolute", inset: 0 }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <button
        type="button"
        className={styles.pencil}
        style={{ position: "absolute", top: -6, right: -6, opacity: 1, margin: 0 }}
        onClick={() => inputRef.current?.click()}
        disabled={pending}
        aria-label="Upload logo"
      >
        {pending ? "…" : "⬆"}
      </button>
      {error && (
        <span
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 6,
            background: "var(--panel)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 12,
            color: "#c0392b",
            whiteSpace: "nowrap",
            zIndex: 30
          }}
        >
          {error}
        </span>
      )}
    </span>
  );
}
