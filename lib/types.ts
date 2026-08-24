export type Lang = "en" | "de";
export type Theme = "light" | "dark";
export type TabId = "home" | "about" | "projects" | "current";

export interface Localized {
  de: string;
  en: string;
}

export interface TabDef {
  id: TabId;
  label: Localized;
}

export interface HomeFact {
  order: number;
  label: Localized;
  value: Localized;
}

export interface AboutFact {
  id: string;
  order: number;
  label: Localized;
  value: Localized;
}

export interface StackTag {
  id: string;
  order: number;
  name: string;
  icon?: string;
}

export interface Project {
  id: string;
  order: number;
  title: Localized;
  blurb: Localized;
  long1: Localized;
  long2: Localized;
  role: Localized;
  year: Localized;
  techTags: string[];
  repoUrl: string;
  screenshotLabel: Localized;
  inProgress: boolean;
}

export interface Milestone {
  order: number;
  title: Localized;
  note: Localized;
  date: Localized;
  done: boolean;
}
