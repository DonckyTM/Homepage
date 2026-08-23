import { Project } from "@/lib/types";

// Projekte: Titel, Kurzbeschreibung, Langtext, Rolle, Jahr, Tech-Tags, Repo-Link, Screenshot.
export const projects: Project[] = [
  {
    id: "p1",
    order: 1,
    title: { en: "Personal homepage", de: "Persönliche Homepage" },
    blurb: {
      en: "This site — my first project. Tabs, dark mode, two languages, and a build log I actually keep updated.",
      de: "Diese Seite — mein erstes Projekt. Tabs, Dark Mode, zwei Sprachen und ein Build-Log, das ich wirklich pflege."
    },
    long1: {
      en: "My first project outside of work: a small personal site built from scratch, no framework and no template. It has four tabs, a light and dark theme with a full token set, German and English throughout, and a build log I keep honest — including the parts that aren't done.",
      de: "Mein erstes Projekt außerhalb der Arbeit: eine kleine persönliche Seite, von Grund auf gebaut — ohne Framework, ohne Template. Vier Tabs, helles und dunkles Theme mit vollständigen Tokens, durchgehend Deutsch und Englisch, und ein Build-Log, das ehrlich bleibt — inklusive der Punkte, die noch offen sind."
    },
    long2: {
      en: "The interesting part wasn't the code. Getting spacing, type and contrast to feel calm took far longer than the logic did, and that's the part I'd do differently next time: design first, then build.",
      de: "Das Spannende war nicht der Code. Abstände, Typo und Kontrast ruhig wirken zu lassen hat deutlich länger gedauert als die Logik — und genau das würde ich beim nächsten Mal anders machen: erst gestalten, dann bauen."
    },
    role: { en: "Everything — design and code", de: "Alles — Design und Code" },
    year: { en: "2026 · in progress", de: "2026 · in Arbeit" },
    techTags: ["HTML", "CSS", "JavaScript"],
    repoUrl: "https://github.com/DonckyTM",
    screenshotLabel: { en: "screenshot", de: "screenshot" },
    inProgress: true
  }
];
