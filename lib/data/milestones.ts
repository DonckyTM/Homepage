import { Milestone } from "@/lib/types";

// Build-Log / Meilensteine. Fortschritt wird daraus berechnet, nicht gespeichert.
export const milestones: Milestone[] = [
  {
    order: 1,
    title: { en: "Decide what the site should be", de: "Festlegen, was die Seite sein soll" },
    note: { en: "Four tabs, no blog, no clutter.", de: "Vier Tabs, kein Blog, kein Ballast." },
    date: { en: "Jul 2026", de: "Jul. 2026" },
    done: true
  },
  {
    order: 2,
    title: { en: "Structure and navigation", de: "Struktur und Navigation" },
    note: {
      en: "Home, About, Projects, Current — one tab bar, no nesting.",
      de: "Home, Über mich, Projekte, Aktuell — eine Tab-Leiste, keine Verschachtelung."
    },
    date: { en: "Jul 2026", de: "Jul. 2026" },
    done: true
  },
  {
    order: 3,
    title: { en: "Visual language", de: "Visuelle Sprache" },
    note: { en: "Type scale, neutral palette, one accent.", de: "Typo-Skala, neutrale Palette, ein Akzent." },
    date: { en: "Aug 2026", de: "Aug. 2026" },
    done: true
  },
  {
    order: 4,
    title: { en: "Dark mode", de: "Dark Mode" },
    note: { en: "Full token set for both themes.", de: "Vollständige Tokens für beide Themes." },
    date: { en: "Aug 2026", de: "Aug. 2026" },
    done: true
  },
  {
    order: 5,
    title: { en: "German + English", de: "Deutsch + Englisch" },
    note: {
      en: "Every string translated, toggle in the header.",
      de: "Jeder Text übersetzt, Umschalter im Header."
    },
    date: { en: "Aug 2026", de: "Aug. 2026" },
    done: true
  },
  {
    order: 6,
    title: { en: "Real project entries", de: "Echte Projekteinträge" },
    note: { en: "Waiting on the first finished project.", de: "Wartet auf das erste fertige Projekt." },
    date: { en: "open", de: "offen" },
    done: false
  },
  {
    order: 7,
    title: { en: "Put it online", de: "Online stellen" },
    note: { en: "Own domain, deploy pipeline.", de: "Eigene Domain, Deploy-Pipeline." },
    date: { en: "open", de: "offen" },
    done: false
  }
];
