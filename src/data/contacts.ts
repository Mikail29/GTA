import type { Category, Contact } from "@/types/content";

/**
 * Personen & Kontakte im Spiel.
 * Bisher nur die beiden Hauptfiguren, die Rockstar offiziell vorgestellt hat.
 * Weitere Einträge folgen nach dem Release (19.11.2026), sobald sie geprüft sind.
 * Keine erfundenen Namen oder Telefonnummern eintragen! Texte immer in eigenen Worten.
 */
export const contactCategories: Category[] = [
  { slug: "hauptfiguren", name: "Hauptfiguren", description: "Die beiden Figuren, die du in GTA 6 spielst.", icon: "star", accent: "pink" },
  { slug: "auftraggeber", name: "Auftraggeber", description: "Personen, die dir Aufträge und Missionen geben.", icon: "target", accent: "pink" },
  { slug: "haendler", name: "Händler", description: "Kontakte, über die du etwas kaufen oder bestellen kannst.", icon: "wallet", accent: "sunset" },
  { slug: "helfer", name: "Helfer & Dienste", description: "Wer dir unterwegs aus der Klemme hilft.", icon: "wrench", accent: "teal" },
  { slug: "bekannte", name: "Freunde & Bekannte", description: "Figuren, mit denen du Zeit verbringen kannst.", icon: "users", accent: "violet" },
];

const official = { label: "Rockstar Games – offizielle Seite zu GTA VI", url: "https://www.rockstargames.com/VI" };

export const contacts: Contact[] = [
  {
    slug: "jason-duval",
    name: "Jason Duval",
    category: "hauptfiguren",
    helpsWith:
      "Einer der beiden Hauptfiguren. Laut Rockstar ist er unter Betrügern aufgewachsen, war bei der Armee und hat danach für Drogenschmuggler auf den Keys gearbeitet. Er wünscht sich ein ruhiges Leben – doch es wird immer schwieriger.",
    location: "Spielbare Hauptfigur",
    status: "verifiziert",
    source: official,
  },
  {
    slug: "lucia-caminos",
    name: "Lucia Caminos",
    category: "hauptfiguren",
    helpsWith:
      "Die zweite Hauptfigur. Laut Rockstar hat ihr Vater ihr schon früh das Kämpfen beigebracht. Weil sie für ihre Familie gekämpft hat, kam sie ins Gefängnis von Leonida und ist nur durch Glück wieder herausgekommen.",
    location: "Spielbare Hauptfigur",
    status: "verifiziert",
    source: official,
  },
];
