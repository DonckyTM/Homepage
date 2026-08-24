import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <p className={styles.text}>
          Logged in as <span className={styles.email}>{user?.email}</span>
        </p>
      </div>
    </main>
  );
}
