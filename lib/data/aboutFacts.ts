import { AboutFact, HomeFact } from "@/lib/types";

// About – Fakten-Tabelle: Rolle, Unternehmen, Lehrjahr, Standort, Schwerpunkt.
export const aboutFacts: AboutFact[] = [
  { order: 1, label: { en: "Role", de: "Rolle" }, value: { en: "Software Engineer (Apprentice)", de: "Softwareentwickler (Azubi)" } },
  { order: 2, label: { en: "Company", de: "Unternehmen" }, value: { en: "Deutsche Börse", de: "Deutsche Börse" } },
  { order: 3, label: { en: "Year", de: "Lehrjahr" }, value: { en: "3rd of apprenticeship", de: "3. Lehrjahr" } },
  { order: 4, label: { en: "Based in", de: "Standort" }, value: { en: "Frankfurt am Main, DE", de: "Frankfurt am Main, DE" } },
  { order: 5, label: { en: "Focus", de: "Schwerpunkt" }, value: { en: "Backend · C++", de: "Backend · C++" } }
];

// Condensed subset shown as the three fact cards on the Home tab.
export const homeFacts: HomeFact[] = [
  { order: 1, label: { en: "Role", de: "Rolle" }, value: { en: "SWE Apprentice", de: "SWE-Azubi" } },
  { order: 2, label: { en: "Based in", de: "Standort" }, value: { en: "Frankfurt a. M.", de: "Frankfurt a. M." } },
  { order: 3, label: { en: "Focus", de: "Schwerpunkt" }, value: { en: "Backend · C++", de: "Backend · C++" } }
];
