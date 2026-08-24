"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Theme } from "@/lib/types";
import { deleteContactSubmissionInline } from "@/app/admin/contact/actions";
import styles from "@/app/admin/contact/page.module.css";

const STORAGE_KEY = "fd-home";

export interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface Persisted {
  lang?: "en" | "de";
  theme?: Theme;
}

// Reuses the same "fd-home" localStorage key as the public site's
// useSiteState, so the theme picked here stays in sync with the rest of
// the page instead of drifting into its own separate preference.
export function ContactInboxView({ submissions }: { submissions: Submission[] }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [items, setItems] = useState(submissions);

  useEffect(() => {
    setItems(submissions);
  }, [submissions]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: Persisted = JSON.parse(raw);
      if (parsed.theme) setTheme(parsed.theme);
    } catch {
      // ignore malformed storage
    }
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed: Persisted = raw ? JSON.parse(raw) : {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, theme: next }));
      } catch {
        // ignore write failures (e.g. private browsing)
      }
      return next;
    });
  }

  return (
    <div id="app" data-theme={theme}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact inbox</h1>
          <div className={styles.headerActions}>
            <button className={styles.themeBtn} title="Theme" aria-label="Toggle theme" onClick={toggleTheme}>
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <Link href="/admin" className={styles.back}>
              ← Back to site
            </Link>
          </div>
        </div>

        {items.length === 0 && <p className={styles.empty}>No submissions yet.</p>}

        {items.length > 0 && (
          <div className={styles.list}>
            {items.map((submission) => (
              <SubmissionItem
                key={submission.id}
                submission={submission}
                onDeleted={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SubmissionItem({ submission, onDeleted }: { submission: Submission; onDeleted: (id: string) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function remove() {
    startTransition(async () => {
      await deleteContactSubmissionInline(submission.id);
      onDeleted(submission.id);
      router.refresh();
    });
  }

  return (
    <article className={styles.item}>
      <div className={styles.itemHead}>
        <span className={styles.name}>{submission.name}</span>
        {confirming ? (
          <span className={styles.confirmRow}>
            <span className={styles.confirmText}>Delete this message?</span>
            <button type="button" className={styles.confirmCancel} onClick={() => setConfirming(false)} disabled={pending}>
              Cancel
            </button>
            <button type="button" className={styles.confirmDelete} onClick={remove} disabled={pending}>
              {pending ? "Deleting…" : "Delete"}
            </button>
          </span>
        ) : (
          <span className={styles.itemHeadRight}>
            <time className={styles.date} dateTime={submission.created_at}>
              {new Date(submission.created_at).toLocaleString()}
            </time>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => setConfirming(true)}
              aria-label={`Delete message from ${submission.name}`}
              title="Delete"
            >
              ✕
            </button>
          </span>
        )}
      </div>
      <p className={styles.email}>
        <a href={`mailto:${submission.email}`}>{submission.email}</a>
      </p>
      <p className={styles.message}>{submission.message}</p>
    </article>
  );
}
