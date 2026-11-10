import type { Category, Contact } from "@/types/content";

/**
 * Personen & Kontakte im Spiel.
 * Noch leer: Einträge werden nach dem Release (19.11.2026) ergänzt, sobald sie
 * geprüft sind. Keine erfundenen Namen oder Telefonnummern eintragen!
 */
export const contactCategories: Category[] = [
  { slug: "auftraggeber", name: "Auftraggeber", description: "Personen, die dir Aufträge und Missionen geben.", icon: "target", accent: "pink" },
  { slug: "haendler", name: "Händler", description: "Kontakte, über die du etwas kaufen oder bestellen kannst.", icon: "wallet", accent: "sunset" },
  { slug: "helfer", name: "Helfer & Dienste", description: "Wer dir unterwegs aus der Klemme hilft.", icon: "wrench", accent: "teal" },
  { slug: "bekannte", name: "Freunde & Bekannte", description: "Figuren, mit denen du Zeit verbringen kannst.", icon: "users", accent: "violet" },
];

export const contacts: Contact[] = [];
