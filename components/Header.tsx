"use client";

import { Lang, TabDef, TabId, Theme } from "@/lib/types";
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
  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>FD</div>
          <span className={styles.brandName}>Florian Dehm</span>
        </div>

        <nav className={styles.tabs}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${tab === t.id ? styles.tabBtnActive : ""}`}
              onClick={() => onTabChange(t.id)}
            >
              {t.label[lang]}
            </button>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <button className={styles.btnLang} title="Sprache wechseln" onClick={onToggleLang}>
            {lang === "en" ? "EN / DE" : "DE / EN"}
          </button>
          <button className={styles.btnTheme} title="Theme" onClick={onToggleTheme}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </div>
    </header>
  );
}
