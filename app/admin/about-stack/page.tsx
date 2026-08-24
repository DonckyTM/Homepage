import { createClient } from "@/lib/supabase/server";
import { createStackTag, deleteStackTag, moveStackTag, updateStackTag } from "./actions";
import styles from "./page.module.css";

export default async function AdminAboutStackPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_stack")
    .select("id, name, icon, order")
    .order("order");

  if (error) {
    throw new Error(`Failed to load about_stack: ${error.message}`);
  }

  const tags = data ?? [];

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>About — stack &amp; tags</h1>
      <ul className={styles.list}>
        {tags.map((tag, index) => (
          <li key={tag.id} className={styles.row}>
            <form action={updateStackTag} className={styles.editForm}>
              <input type="hidden" name="id" value={tag.id} />
              <div className={styles.fields}>
                <label className={styles.field}>
                  <span>Name</span>
                  <input name="name" defaultValue={tag.name} required />
                </label>
                <label className={styles.field}>
                  <span>Icon (optional)</span>
                  <input name="icon" defaultValue={tag.icon ?? ""} />
                </label>
              </div>
              <div className={styles.rowActions}>
                <button type="submit" formAction={deleteStackTag} className={styles.delete}>
                  Delete
                </button>
                <button type="submit" className={styles.save}>
                  Save
                </button>
              </div>
            </form>
            <div className={styles.moveCol}>
              <form action={moveStackTag} className={styles.moveForm}>
                <input type="hidden" name="id" value={tag.id} />
                <input type="hidden" name="direction" value="up" />
                <button type="submit" className={styles.moveBtn} disabled={index === 0}>
                  ↑
                </button>
              </form>
              <form action={moveStackTag} className={styles.moveForm}>
                <input type="hidden" name="id" value={tag.id} />
                <input type="hidden" name="direction" value="down" />
                <button type="submit" className={styles.moveBtn} disabled={index === tags.length - 1}>
                  ↓
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>

      <section className={styles.addSection}>
        <h2 className={styles.subtitle}>Add new tag</h2>
        <form action={createStackTag} className={styles.addForm}>
          <div className={styles.fields}>
            <label className={styles.field}>
              <span>Name</span>
              <input name="name" required />
            </label>
            <label className={styles.field}>
              <span>Icon (optional)</span>
              <input name="icon" />
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
