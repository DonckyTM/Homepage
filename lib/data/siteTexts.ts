import { Localized } from "@/lib/types";

// Site-Texte: Hero, About-Absätze, Section-Labels — keyed, DE/EN.
export const siteTexts: Record<string, Localized> = {
  statusPill: { en: "Currently building this site", de: "Baue gerade diese Seite" },
  heroTitle: { en: "Backend apprentice, C++ curious.", de: "Backend-Azubi, neugierig auf C++." },
  heroBody: {
    en: "I'm Florian — a third-year software engineering apprentice at Deutsche Börse in Frankfurt. I spend most of my time on backend systems and C++, and this page is where I'll keep track of what I build along the way.",
    de: "Ich bin Florian — Fachinformatiker-Azubi im dritten Lehrjahr bei der Deutschen Börse in Frankfurt. Den Großteil meiner Zeit verbringe ich mit Backend-Systemen und C++, und hier halte ich fest, was dabei entsteht."
  },
  ctaMail: { en: "Say hello", de: "Schreib mir" },
  nowLabel: { en: "Right now", de: "Gerade jetzt" },
  nowTitle: { en: "Building my first project — this homepage", de: "Mein erstes Projekt — diese Homepage" },
  nowBody: {
    en: "My first real web project, written from scratch. Follow the build log to see where it stands.",
    de: "Mein erstes richtiges Webprojekt, von Grund auf gebaut. Im Build-Log siehst du, wo es steht."
  },
  nowCta: { en: "See the build log", de: "Zum Build-Log" },

  aboutTitle: { en: "About me", de: "Über mich" },
  aboutP1: {
    en: "I'm Florian Dehm, a software engineering apprentice in my third year at Deutsche Börse, based in Frankfurt am Main.",
    de: "Ich bin Florian Dehm, Softwareentwickler-Azubi im dritten Lehrjahr bei der Deutschen Börse, wohnhaft in Frankfurt am Main."
  },
  aboutP2: {
    en: "Most of my day is backend work — the parts of a system nobody sees but everything depends on. C++ is what I keep coming back to: it's unforgiving, and that's exactly why I like it.",
    de: "Der größte Teil meines Tages ist Backend-Arbeit — die Teile eines Systems, die niemand sieht und von denen alles abhängt. C++ ist das, wozu ich immer zurückkomme: es verzeiht nichts, und genau deshalb mag ich es."
  },
  aboutP3: {
    en: "This site is my first project outside of work. It's small on purpose. I'd rather finish something honest than start something ambitious and drop it.",
    de: "Diese Seite ist mein erstes Projekt außerhalb der Arbeit. Bewusst klein gehalten. Lieber etwas Ehrliches fertigstellen als etwas Großes anfangen und liegen lassen."
  },
  stackLabel: { en: "Working with", de: "Arbeite mit" },

  projectsTitle: { en: "Projects", de: "Projekte" },
  projectsIntro: {
    en: "One at a time, finished before the next. Here's what exists so far.",
    de: "Eins nach dem anderen, fertig bevor das nächste beginnt. Das hier gibt es bisher."
  },
  cardCta: { en: "Details", de: "Details" },
  inProgress: { en: "In progress", de: "In Arbeit" },
  emptyTitle: { en: "Nothing else here yet", de: "Sonst noch nichts" },
  emptyBody: {
    en: "The second project starts once the first one is genuinely done. Check back.",
    de: "Das zweite Projekt startet, wenn das erste wirklich fertig ist. Schau später nochmal vorbei."
  },
  modalRepo: { en: "View on GitHub", de: "Auf GitHub ansehen" },
  modalClose: { en: "Close", de: "Schließen" },
  modalRoleLabel: { en: "Role", de: "Rolle" },
  modalYearLabel: { en: "Status", de: "Status" },
  modalTechLabel: { en: "Built with", de: "Gebaut mit" },

  currentTitle: { en: "Current project", de: "Aktuelles Projekt" },
  updated: { en: "Updated Aug 2026", de: "Stand Aug. 2026" },
  currentIntro: {
    en: "This homepage. Here's an honest checklist of what's done and what's still open.",
    de: "Diese Homepage. Hier eine ehrliche Checkliste: was steht und was noch offen ist."
  },
  progressLabel: { en: "Progress", de: "Fortschritt" },
  learningLabel: { en: "What I'm learning from it", de: "Was ich dabei lerne" },
  learningBody: {
    en: "Layout is harder than logic. Getting spacing, type and contrast to feel calm took longer than any of the code — and I'd rather sit with that than hide it behind a template.",
    de: "Layout ist schwerer als Logik. Abstände, Typo und Kontrast ruhig wirken zu lassen hat länger gedauert als der ganze Code — und das gebe ich lieber zu, als es hinter einem Template zu verstecken."
  }
};

export const tabLabels: Record<string, Localized> = {
  home: { en: "Home", de: "Start" },
  about: { en: "About", de: "Über mich" },
  projects: { en: "Projects", de: "Projekte" },
  current: { en: "Current", de: "Aktuell" }
};
