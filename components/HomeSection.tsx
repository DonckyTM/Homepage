"use client";

import { HomeFact, Lang, Localized } from "@/lib/types";
import { EditableText } from "@/components/admin/EditableText";
import { EditableWrap } from "@/components/admin/EditableWrap";
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
          <EditableText textKey="statusPill" value={t.statusPill} lang={lang} />
        </div>
        <EditableText as="h1" textKey="heroTitle" value={t.heroTitle} lang={lang} />
        <EditableText as="p" className={styles.heroBody} textKey="heroBody" value={t.heroBody} lang={lang} multiline />

        <div className={styles.heroActions}>
          <EditableWrap textKey="ctaMail" value={t.ctaMail}>
            <a href="mailto:florian@dehm-online.de" className={styles.btnPrimary}>
              {t.ctaMail[lang]}
            </a>
          </EditableWrap>
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
          <EditableText as="div" className={shared.eyebrow} textKey="nowLabel" value={t.nowLabel} lang={lang} />
          <EditableText as="div" className={styles.nowTitle} textKey="nowTitle" value={t.nowTitle} lang={lang} />
          <EditableText as="p" className={styles.nowBody} textKey="nowBody" value={t.nowBody} lang={lang} multiline />
        </div>
        <EditableWrap textKey="nowCta" value={t.nowCta}>
          <button className={styles.btnOutline} onClick={onGoCurrent}>
            {t.nowCta[lang]} →
          </button>
        </EditableWrap>
      </div>
    </>
  );
}
