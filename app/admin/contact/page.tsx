import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import styles from "./page.module.css";

// Uses the service-role client directly (no cookies()/session read), so
// Next can't infer this needs per-request rendering on its own — force it,
// otherwise the inbox would be statically prerendered once at build time.
export const dynamic = "force-dynamic";

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default async function AdminContactPage() {
  // contact_submissions has no RLS read policy for authenticated users either
  // (see supabase/migrations/20260824080617_content_tables_rls.sql) — only
  // the service role bypasses RLS, so this page can't use the regular
  // session-scoped client used elsewhere in app/admin.
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load contact_submissions: ${error.message}`);
  }

  const submissions = (data ?? []) as Submission[];

  return (
    <div id="app" data-theme="light">
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact inbox</h1>
          <Link href="/admin" className={styles.back}>
            ← Back to site
          </Link>
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
