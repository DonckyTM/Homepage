import { createClient } from "@/lib/supabase/server";
import { createAboutFact, deleteAboutFact, moveAboutFact, updateAboutFact } from "./actions";
import styles from "./page.module.css";

export default async function AdminAboutFactsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_facts")
    .select("id, label_de, label_en, value_de, value_en, order")
    .order("order");

  if (error) {
    throw new Error(`Failed to load about_facts: ${error.message}`);
  }

  const facts = data ?? [];

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>About — facts</h1>
      <ul className={styles.list}>
        {facts.map((fact, index) => (
          <li key={fact.id} className={styles.row}>
            <form action={updateAboutFact} className={styles.editForm}>
              <input type="hidden" name="id" value={fact.id} />
              <div className={styles.fields}>
                <label className={styles.field}>
                  <span>Label (DE)</span>
                  <input name="label_de" defaultValue={fact.label_de} required />
                </label>
                <label className={styles.field}>
                  <span>Label (EN)</span>
                  <input name="label_en" defaultValue={fact.label_en} required />
                </label>
                <label className={styles.field}>
                  <span>Value (DE)</span>
                  <input name="value_de" defaultValue={fact.value_de} required />
                </label>
                <label className={styles.field}>
                  <span>Value (EN)</span>
                  <input name="value_en" defaultValue={fact.value_en} required />
                </label>
              </div>
              <div className={styles.rowActions}>
                <button type="submit" formAction={deleteAboutFact} className={styles.delete}>
                  Delete
                </button>
                <button type="submit" className={styles.save}>
                  Save
                </button>
              </div>
            </form>
            <div className={styles.moveCol}>
              <form action={moveAboutFact} className={styles.moveForm}>
                <input type="hidden" name="id" value={fact.id} />
                <input type="hidden" name="direction" value="up" />
                <button type="submit" className={styles.moveBtn} disabled={index === 0}>
                  ↑
                </button>
              </form>
              <form action={moveAboutFact} className={styles.moveForm}>
                <input type="hidden" name="id" value={fact.id} />
                <input type="hidden" name="direction" value="down" />
                <button type="submit" className={styles.moveBtn} disabled={index === facts.length - 1}>
                  ↓
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      <section className={styles.addSection}>
        <h2 className={styles.subtitle}>Add new fact</h2>
        <form action={createAboutFact} className={styles.addForm}>
          <div className={styles.fields}>
            <label className={styles.field}>
              <span>Label (DE)</span>
              <input name="label_de" required />
            </label>
            <label className={styles.field}>
              <span>Label (EN)</span>
              <input name="label_en" required />
            </label>
            <label className={styles.field}>
              <span>Value (DE)</span>
              <input name="value_de" required />
            </label>
            <label className={styles.field}>
              <span>Value (EN)</span>
              <input name="value_en" required />
            </label>
          </div>
          <div className={styles.rowActions}>
            <button type="submit" className={styles.save}>
              Add
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
