import type { Category } from "@/types/content";
import type { CommunityCategory } from "@/types/community";

export const articleCategories: Category[] = [
  { slug: "anfaenger", name: "Anfänger-Tipps", description: "Der leichte Einstieg: Grundlagen, Orientierung und erste Schritte.", icon: "rocket", accent: "teal" },
  { slug: "fahrzeuge", name: "Fahrzeuge", description: "Rund um Autos, Boote und alles, was fährt, fliegt oder schwimmt.", icon: "car", accent: "pink" },
  { slug: "waffen", name: "Waffen", description: "Ausrüstung, Taktik und Kampf – sobald verlässliche Infos vorliegen.", icon: "crosshair", accent: "sunset" },
  { slug: "geld", name: "Geld & Wirtschaft", description: "Sinnvoll sparen, investieren und Ressourcen planen.", icon: "wallet", accent: "violet" },
  { slug: "gameplay", name: "Gameplay", description: "Spielmechaniken, Systeme und clevere Spielweisen.", icon: "gamepad", accent: "teal" },
  { slug: "charaktere", name: "Charaktere", description: "Hintergründe zu den Figuren – mit klarer Quellenangabe.", icon: "user", accent: "pink" },
  { slug: "einstellungen", name: "Einstellungen", description: "Grafik, Steuerung, Barrierefreiheit und Komfort-Optionen.", icon: "settings", accent: "violet" },
  { slug: "fortgeschritten", name: "Fortgeschrittene Tipps", description: "Für alle, die mehr aus jeder Spielsitzung herausholen wollen.", icon: "trophy", accent: "sunset" },
];

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
