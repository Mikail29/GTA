import type { Category, GameSymbol } from "@/types/content";

/**
 * Symbole im Spiel – Karte, Radar und Anzeige.
 * Noch leer: Einträge werden nach dem Release (19.11.2026) ergänzt, sobald sie
 * geprüft sind. Die Kategorien sind unsere eigene Gliederung.
 *
 * Wichtig (Urheberrecht): Keine Original-Grafiken aus dem Spiel verwenden.
 * Jedes Symbol wird in eigenen Worten beschrieben („looks“) und auf der Website
 * mit einem eigenen, vereinfachten Zeichen („icon“) dargestellt.
 */
export const symbolCategories: Category[] = [
  { slug: "karte", name: "Karte & Navigation", description: "Ziele, Wegpunkte und Orte auf der Karte und dem Radar.", icon: "compass", accent: "teal" },
  { slug: "missionen", name: "Missionen & Kontakte", description: "Woran du Aufträge, Auftraggeber und Story-Ereignisse erkennst.", icon: "target", accent: "pink" },
  { slug: "laeden", name: "Läden & Dienste", description: "Waffen, Kleidung, Werkstätten und andere Anlaufstellen.", icon: "building", accent: "sunset" },
  { slug: "aktivitaeten", name: "Aktivitäten & Sammelobjekte", description: "Freizeit, Nebenbeschäftigungen und Dinge zum Finden.", icon: "palm", accent: "violet" },
  { slug: "anzeige", name: "Anzeige & Status", description: "Symbole am Bildschirmrand, z. B. für Gesundheit, Geld und Waffen.", icon: "heart", accent: "teal" },
  { slug: "fahndung", name: "Fahndung & Polizei", description: "Alles rund um Fahndungsstufe und Einsatzkräfte.", icon: "star", accent: "pink" },
];

export const symbols: GameSymbol[] = [];
