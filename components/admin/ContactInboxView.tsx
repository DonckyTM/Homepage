"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Theme } from "@/lib/types";
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

        {submissions.length === 0 && <p className={styles.empty}>No submissions yet.</p>}

        {submissions.length > 0 && (
          <div className={styles.list}>
            {submissions.map((submission) => (
              <article key={submission.id} className={styles.item}>
                <div className={styles.itemHead}>
                  <span className={styles.name}>{submission.name}</span>
                  <time className={styles.date} dateTime={submission.created_at}>
                    {new Date(submission.created_at).toLocaleString()}
                  </time>
                </div>
                <p className={styles.email}>
                  <a href={`mailto:${submission.email}`}>{submission.email}</a>
                </p>
                <p className={styles.message}>{submission.message}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
