"use client";

import { Lang, Localized, Milestone } from "@/lib/types";
import { EditableText } from "@/components/admin/EditableText";
import { EditableMilestones } from "@/components/admin/EditableMilestones";
import styles from "./CurrentSection.module.css";
import shared from "./shared.module.css";

interface CurrentSectionProps {
  texts: Record<string, Localized>;
  milestones: Milestone[];
  lang: Lang;
}

export function CurrentSection({ texts: t, milestones, lang }: CurrentSectionProps) {
  const sorted = milestones.slice().sort((a, b) => a.order - b.order);
  const done = sorted.filter((m) => m.done).length;
  // Guard the empty case — milestones can all be deleted from the admin view.
  const pct = sorted.length === 0 ? 0 : Math.round((done / sorted.length) * 100);

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <EditableText as="h2" textKey="currentTitle" value={t.currentTitle} lang={lang} />
        <EditableText as="span" className={styles.updated} textKey="updated" value={t.updated} lang={lang} />
      </div>
      <EditableText as="p" className={styles.intro} textKey="currentIntro" value={t.currentIntro} lang={lang} multiline />

      <div className={styles.progressCard}>
        <div className={styles.progressHead}>
          <EditableText as="span" className={styles.progressLabel} textKey="progressLabel" value={t.progressLabel} lang={lang} />
          <span className={styles.progressText}>
            {done} / {sorted.length} · {pct}%
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>

        <EditableMilestones milestones={milestones} lang={lang} />
      </div>

      <div className={styles.learningCard}>
        <EditableText as="div" className={shared.eyebrow} textKey="learningLabel" value={t.learningLabel} lang={lang} />
        <EditableText as="p" className={styles.learningBody} textKey="learningBody" value={t.learningBody} lang={lang} multiline />
      </div>
    </section>
  );
}
