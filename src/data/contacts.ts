import type { Category, Contact } from "@/types/content";

/**
 * Personen & Kontakte im Spiel.
 * Figuren, die Rockstar offiziell vorgestellt hat, und Kontakte, die mehrere unabhängige
 * Quellen aus dem Spiel bestätigen. Quellen nur intern (Feld source), nicht auf der Website.
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
  {
    slug: "brian-heder",
    name: "Brian Heder",
    category: "auftraggeber",
    helpsWith: "Ein alter Schmuggler auf den Keys, für den Jason arbeitet. In der Mission „Lab Fees“ schickt er Jason los, um bei einem Laden die Miete einzutreiben.",
    location: "Leonida Keys",
    status: "verifiziert",
    source: official,
  },
  {
    slug: "cal-hampton",
    name: "Cal Hampton",
    category: "bekannte",
    helpsWith: "Jasons Freund, der ebenfalls für Brian arbeitet. Er bleibt am liebsten zu Hause, hört den Funk der Küstenwache mit und glaubt an so manche Verschwörung. In „Gone Fishing“ fährt er mit Jason aufs Wasser.",
    location: "Leonida Keys",
    status: "verifiziert",
    source: official,
  },
  {
    slug: "boobie-ike",
    name: "Boobie Ike",
    category: "bekannte",
    helpsWith: "Eine Legende in Vice City: Aus dem Straßengeschäft hat er ein eigenes Firmen-Reich gemacht – mit Häusern, dem Club „Jack of Hearts“ und dem Plattenlabel „Only Raw Records“.",
    location: "Vice City",
    status: "verifiziert",
    source: official,
  },
  {
    slug: "drequan-priest",
    name: "Dre'Quan Priest",
    category: "bekannte",
    helpsWith: "Will ganz groß ins Musikgeschäft. Er arbeitet mit Boobie Ike zusammen und hat das Rap-Duo Real Dimez unter Vertrag genommen.",
    location: "Vice City",
    status: "verifiziert",
    source: official,
  },
  {
    slug: "real-dimez",
    name: "Real Dimez",
    category: "bekannte",
    helpsWith: "Rap-Duo aus Bae-Luxe und Roxy, befreundet seit der Schulzeit. Mit viel Social-Media-Präsenz wollen sie groß rauskommen – unter Vertrag bei Only Raw Records.",
    location: "Vice City",
    status: "verifiziert",
    source: official,
  },
  {
    slug: "raul-bautista",
    name: "Raul Bautista",
    category: "bekannte",
    helpsWith: "Ein erfahrener Bankräuber, der seine Überfälle plant wie Kunstwerke – und dafür immer wieder neue Leute sucht.",
    status: "verifiziert",
    source: official,
  },
  {
    slug: "joey-mechaniker",
    name: "Joey (Mechaniker)",
    category: "helfer",
    helpsWith: "Mechaniker bei Coastal Auto Care. Nach der Mission „Just a Scratch“ steht er in deinen Kontakten und hilft dir bei Reparaturen und beim Abschleppen.",
    location: "Coastal Auto Care – freigeschaltet nach „Just a Scratch“",
    status: "verifiziert",
    source: { label: "GTA BOOM: Just a Scratch", url: "https://www.gtaboom.com/gta-6-just-a-scratch-mission-walkthrough-da82" },
  },
  {
    slug: "donnie",
    name: "Donnie",
    category: "auftraggeber",
    helpsWith:
      "Der Pilot bei Brians Schmuggel-Geschäft. In „Gone Fishing“ wirft er aus seinem Flugzeug die Pakete ab – danach muss Jason ihn aus den Händen der Kingfishers holen. Später meldet er sich per Telefon mit neuen Aufträgen.",
    location: "Leonida Keys",
    status: "verifiziert",
    source: { label: "Video Games Chronicle: Gone Fishing", url: "https://www.videogameschronicle.com/guide/gta-6-gone-fishing-mission-walkthrough/" },
  },
  {
    slug: "kirk-skunk-ape",
    name: "Kirk (Skunk-Ape-Jäger)",
    category: "auftraggeber",
    helpsWith:
      "Kirk jagt den Skunk Ape – die Bigfoot-Legende von Leonida. Nach deiner ersten Begegnung mit dem Wesen hängen seine Flyer aus. Rufst du ihn an, startet eine eigene Auftragsreihe; die erste Suche geht nur nachts.",
    location: "Über seine Flyer, z. B. in Skeeter's Bar in Hamlet",
    mapLocationId: "geheimnis-skunk-ape",
    status: "verifiziert",
    source: { label: "GamerFuzion: Skunk Ape und Kirk", url: "https://www.gamerfuzion.com/gta-6-bigfoot-skunk-ape-easter-egg/" },
  },
];
