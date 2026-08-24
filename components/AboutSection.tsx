"use client";

import { AboutFact, Lang, Localized, StackTag } from "@/lib/types";
import { EditableText } from "@/components/admin/EditableText";
import { EditableAboutFacts } from "@/components/admin/EditableAboutFacts";
import { EditableStackTags } from "@/components/admin/EditableStackTags";
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
      <EditableText as="h2" textKey="aboutTitle" value={t.aboutTitle} lang={lang} />
      <div className={styles.aboutGrid}>
        <div className={styles.aboutCopy}>
          <EditableText as="p" textKey="aboutP1" value={t.aboutP1} lang={lang} multiline />
          <EditableText as="p" className={styles.muted} textKey="aboutP2" value={t.aboutP2} lang={lang} multiline />
          <EditableText as="p" className={styles.muted} textKey="aboutP3" value={t.aboutP3} lang={lang} multiline />
        </div>
        <EditableAboutFacts facts={aboutFacts} lang={lang} />
      </div>

      <div className={styles.stackBlock}>
        <EditableText
          as="div"
          className={`${shared.eyebrow} ${styles.stackLabel}`}
          textKey="stackLabel"
          value={t.stackLabel}
          lang={lang}
        />
        <EditableStackTags tags={stack} />
      </div>
    </section>
  );
}
