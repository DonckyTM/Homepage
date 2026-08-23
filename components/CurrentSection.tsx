"use client";

import { Lang } from "@/lib/types";
import { siteTexts } from "@/lib/data/siteTexts";
import { milestones } from "@/lib/data/milestones";
import styles from "./CurrentSection.module.css";
import shared from "./shared.module.css";

export function CurrentSection({ lang }: { lang: Lang }) {
  const t = siteTexts;
  const sorted = milestones.slice().sort((a, b) => a.order - b.order);
  const done = sorted.filter((m) => m.done).length;
  const pct = Math.round((done / sorted.length) * 100);

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <h2>{t.currentTitle[lang]}</h2>
        <span className={styles.updated}>{t.updated[lang]}</span>
      </div>
      <p className={styles.intro}>{t.currentIntro[lang]}</p>

      <div className={styles.progressCard}>
        <div className={styles.progressHead}>
          <span className={styles.progressLabel}>{t.progressLabel[lang]}</span>
          <span className={styles.progressText}>
            {done} / {sorted.length} · {pct}%
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>

        <div className={styles.milestones}>
          {sorted.map((m) => (
            <div className={`${styles.milestone} ${m.done ? styles.milestoneDone : ""}`} key={m.order}>
              <div className={styles.dot}>{m.done ? "✓" : ""}</div>
              <div className={styles.milestoneBody}>
                <div className={styles.milestoneTitle}>{m.title[lang]}</div>
                <div className={styles.note}>{m.note[lang]}</div>
              </div>
              <div className={styles.date}>{m.date[lang]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.learningCard}>
        <div className={shared.eyebrow}>{t.learningLabel[lang]}</div>
        <p className={styles.learningBody}>{t.learningBody[lang]}</p>
      </div>
    </section>
  );
}
