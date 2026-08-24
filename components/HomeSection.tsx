"use client";

import { HomeFact, Lang, Localized } from "@/lib/types";
import styles from "./HomeSection.module.css";
import shared from "./shared.module.css";

interface HomeSectionProps {
  texts: Record<string, Localized>;
  facts: HomeFact[];
  lang: Lang;
  onGoCurrent: () => void;
}

export function HomeSection({ texts: t, facts: homeFacts, lang, onGoCurrent }: HomeSectionProps) {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.pill}>
          <span className={styles.pillDot} />
          {t.statusPill[lang]}
        </div>
        <h1>{t.heroTitle[lang]}</h1>
        <p className={styles.heroBody}>{t.heroBody[lang]}</p>

        <div className={styles.heroActions}>
          <a href="mailto:florian@dehm-online.de" className={styles.btnPrimary}>
            {t.ctaMail[lang]}
          </a>
          <a href="https://github.com/DonckyTM" target="_blank" rel="noreferrer" className={styles.btnSecondary}>
            GitHub
          </a>
        </div>
      </div>

      <div className={styles.facts}>
        {homeFacts.map((f) => (
          <div className={styles.factCard} key={f.order}>
            <div className={shared.eyebrow}>{f.label[lang]}</div>
            <div className={styles.factVal}>{f.value[lang]}</div>
          </div>
        ))}
      </div>

      <div className={styles.nowCard}>
        <div className={styles.nowCopy}>
          <div className={shared.eyebrow}>{t.nowLabel[lang]}</div>
          <div className={styles.nowTitle}>{t.nowTitle[lang]}</div>
          <p className={styles.nowBody}>{t.nowBody[lang]}</p>
        </div>
        <button className={styles.btnOutline} onClick={onGoCurrent}>
          {t.nowCta[lang]} →
        </button>
      </div>
    </>
  );
}
