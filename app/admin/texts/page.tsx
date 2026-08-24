import { createClient } from "@/lib/supabase/server";
import { updateSiteText } from "./actions";
import styles from "./page.module.css";

export default async function AdminTextsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_texts")
    .select("key, value_de, value_en")
    .order("key");

  if (error) {
    throw new Error(`Failed to load site_texts: ${error.message}`);
  }

  const texts = data ?? [];

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Site texts</h1>
      <ul className={styles.list}>
        {texts.map((text) => (
          <li key={text.key} className={styles.row}>
            <form action={updateSiteText}>
              <input type="hidden" name="key" value={text.key} />
              <p className={styles.key}>{text.key}</p>
              <div className={styles.fields}>
                <label className={styles.field}>
                  <span>DE</span>
                  <textarea name="value_de" defaultValue={text.value_de} rows={2} required />
                </label>
                <label className={styles.field}>
                  <span>EN</span>
                  <textarea name="value_en" defaultValue={text.value_en} rows={2} required />
                </label>
              </div>
              <div className={styles.rowActions}>
                <button type="submit" className={styles.save}>
                  Save
                </button>
              </div>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
