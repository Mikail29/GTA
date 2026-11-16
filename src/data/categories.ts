import type { Category } from "@/types/content";
import type { CommunityCategory } from "@/types/community";

export const missionCategories: Category[] = [
  { slug: "hauptstory", name: "Hauptstory", description: "Missionen der Haupthandlung.", icon: "scroll", accent: "pink" },
  { slug: "nebenmissionen", name: "Nebenmissionen", description: "Optionale Aufträge und Nebengeschichten.", icon: "target", accent: "teal" },
  { slug: "aktivitaeten", name: "Aktivitäten", description: "Freizeit, Herausforderungen und Minispiele.", icon: "palm", accent: "sunset" },
  { slug: "herausforderungen", name: "Herausforderungen", description: "Bestwerte, Medaillen und Sonderziele.", icon: "trophy", accent: "violet" },
];

export const secretCategories: Category[] = [
  { slug: "easter-eggs", name: "Easter Eggs", description: "Versteckte Anspielungen und Überraschungen.", icon: "sparkles", accent: "pink" },
  { slug: "versteckte-orte", name: "Versteckte Orte", description: "Abgelegene und schwer erreichbare Plätze.", icon: "mappin", accent: "teal" },
  { slug: "gegenstaende", name: "Besondere Gegenstände", description: "Seltene Objekte und Ausrüstung.", icon: "gem", accent: "violet" },
  { slug: "sammelobjekte", name: "Sammelobjekte", description: "Alles, was man finden und sammeln kann.", icon: "trophy", accent: "sunset" },
  { slug: "seltene-fahrzeuge", name: "Seltene Fahrzeuge", description: "Fahrzeuge, die nicht an jeder Ecke stehen.", icon: "car", accent: "pink" },
  { slug: "geheimnisse", name: "Geheimnisse", description: "Mysterien, Rätsel und ungeklärte Fragen.", icon: "eye", accent: "violet" },
];

export const communityCategories: CommunityCategory[] = [
  { slug: "allgemein", name: "Allgemeine Fragen", description: "Alles rund um GTA 6, was sonst nirgends passt." },
  { slug: "missionen", name: "Missionen", description: "Hilfe bei Aufträgen und Komplettlösungen." },
  { slug: "fahrzeuge", name: "Fahrzeuge", description: "Autos, Boote, Flugzeuge und Tuning." },
  { slug: "geheimnisse", name: "Geheimnisse", description: "Easter Eggs, Mysterien und Fundorte." },
  { slug: "gameplay", name: "Gameplay", description: "Spielmechaniken, Strategien und Spielweise." },
  { slug: "technik", name: "Technische Probleme", description: "Leistung, Fehler, Einstellungen und Hardware." },
];

export function findCategory(list: Category[], slug: string) {
  return list.find((c) => c.slug === slug);
}

export function communityCategoryName(slug: string) {
  return communityCategories.find((c) => c.slug === slug)?.name ?? "Allgemein";
}
