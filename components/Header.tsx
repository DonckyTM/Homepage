"use client";

import { useRouter } from "next/navigation";
import { Lang, TabDef, TabId, Theme } from "@/lib/types";
import { useEditMode } from "@/components/admin/EditContext";
import { EditableWrap } from "@/components/admin/EditableWrap";
import { createClient } from "@/lib/supabase/client";
import styles from "./Header.module.css";

interface HeaderProps {
  tabs: TabDef[];
  tab: TabId;
  lang: Lang;
  theme: Theme;
  onTabChange: (id: TabId) => void;
  onToggleLang: () => void;
  onToggleTheme: () => void;
}

export function Header({ tabs, tab, lang, theme, onTabChange, onToggleLang, onToggleTheme }: HeaderProps) {
  const editMode = useEditMode();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>FD</div>
          <span className={styles.brandName}>Florian Dehm</span>
          {editMode && <span className={styles.adminBadge}>Editing</span>}
        </div>

        <nav className={styles.tabs}>
          {tabs.map((t) => (
            <EditableWrap key={t.id} textKey={`tab_${t.id}`} value={t.label}>
              <button
                className={`${styles.tabBtn} ${tab === t.id ? styles.tabBtnActive : ""}`}
                onClick={() => onTabChange(t.id)}
              >
                {t.label[lang]}
              </button>
            </EditableWrap>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <button className={styles.btnLang} title="Sprache wechseln" onClick={onToggleLang}>
            {lang === "en" ? "EN / DE" : "DE / EN"}
          </button>
          <button className={styles.btnTheme} title="Theme" onClick={onToggleTheme}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
          {editMode && (
            <button className={styles.btnTheme} title="Log out" aria-label="Log out" onClick={handleLogout}>
              ⏻
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
