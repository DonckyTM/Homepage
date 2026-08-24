"use client";

import { AboutFact, Lang, Localized, StackTag } from "@/lib/types";
import styles from "./AboutSection.module.css";
import shared from "./shared.module.css";

interface AboutSectionProps {
  texts: Record<string, Localized>;
  facts: AboutFact[];
  stack: StackTag[];
  lang: Lang;
}

export function AboutSection({ texts: t, facts: aboutFacts, stack, lang }: AboutSectionProps) {
  return (
    <section className={styles.section}>
      <h2>{t.aboutTitle[lang]}</h2>
      <div className={styles.aboutGrid}>
        <div className={styles.aboutCopy}>
          <p>{t.aboutP1[lang]}</p>
          <p className={styles.muted}>{t.aboutP2[lang]}</p>
          <p className={styles.muted}>{t.aboutP3[lang]}</p>
        </div>
        <div className={styles.aboutRows}>
          {aboutFacts
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((row) => (
              <div className={styles.aboutRow} key={row.order}>
                <span className={styles.aboutRowK}>{row.label[lang]}</span>
                <span className={styles.aboutRowV}>{row.value[lang]}</span>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.stackBlock}>
        <div className={`${shared.eyebrow} ${styles.stackLabel}`}>{t.stackLabel[lang]}</div>
        <div className={styles.stackTags}>
          {stack
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((s) => (
              <span className={styles.stackTag} key={s.order}>
                {s.name}
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
