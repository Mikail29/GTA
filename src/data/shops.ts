import type { Category, Shop } from "@/types/content";

/**
 * Läden im Spiel.
 * Noch leer: Einträge werden nach dem Release (19.11.2026) ergänzt, sobald sie
 * geprüft sind. Die Kategorien sind unsere Gliederung – welche Läden es im
 * Spiel tatsächlich gibt, wird erst nach dem Release geprüft.
 */
export const shopCategories: Category[] = [
  { slug: "waffen", name: "Waffen", description: "Wo du Waffen und Ausrüstung kaufen kannst.", icon: "crosshair", accent: "pink" },
  { slug: "kleidung", name: "Kleidung", description: "Klamotten, Schuhe und Accessoires.", icon: "user", accent: "violet" },
  { slug: "fahrzeuge", name: "Fahrzeuge & Tuning", description: "Fahrzeughändler und Werkstätten.", icon: "car", accent: "teal" },
  { slug: "essen", name: "Essen & Trinken", description: "Restaurants, Imbisse und Läden für unterwegs.", icon: "flame", accent: "sunset" },
  { slug: "styling", name: "Friseur & Tattoo", description: "Neuer Look für deine Figur.", icon: "sparkles", accent: "pink" },
  { slug: "sonstiges", name: "Sonstige Läden", description: "Alles, was in keine andere Kategorie passt.", icon: "building", accent: "violet" },
];

export const shops: Shop[] = [];
