import type { Secret } from "@/types/content";

/**
 * Geheimnisse & Fundorte in GTA 6 (seit dem Release am 19.11.2026).
 * Regeln: nur geprüfte Fakten (mindestens zwei unabhängige Quellen, offizielle Angabe
 * oder selbst im Spiel gesehen), in eigenen Worten. Quellen nur intern im Feld sources.
 */
export const secrets: Secret[] = [
  {
    slug: "skunk-ape-bigfoot",
    title: "Skunk Ape: Bigfoot in den Sümpfen",
    excerpt: "In den Sümpfen von Grassrivers lebt der „Skunk Ape“ – die Bigfoot-Legende von Leonida. Wer ihm folgt, startet eine eigene Auftragsreihe.",
    category: "easter-eggs",
    status: "verifiziert",
    spoiler: true,
    location: "Grassrivers – Sumpfgebiet rund um Cottonmouth Lake",
    mapLocationId: "geheimnis-skunk-ape",
    blocks: [
      { type: "p", text: "Der „Skunk Ape“ ist die Bigfoot-Sagengestalt von Leonida. Spieler haben ihn kurz nach dem Start gefunden – und er führt zu einer ganzen Reihe von Aufträgen." },
      { type: "h2", id: "finden", text: "So findest du ihn" },
      {
        type: "ol",
        items: [
          "Streife durch die Sümpfe rund um Cottonmouth Lake im Süden von Grassrivers. Die Guides nennen die Gegend unterschiedlich – such einfach im Sumpfgebiet dort.",
          "Siehst du die Gestalt, folge ihr in den Wald.",
          "Dort hängt eine seltsame Figur aus Zweigen an einem Baum. Untersuche sie.",
          "Deine Figur wird ohnmächtig, und eine kurze Szene zeigt den Skunk Ape.",
        ],
      },
      { type: "h2", id: "kirk", text: "Danach: Kirks Aufträge" },
      { type: "p", text: "Nach der ersten Begegnung hängen in Leonida Flyer eines Mannes namens Kirk aus. Lies einen davon und ruf Kirk an – so startet die Nebenmission „Search for the Skunk Ape“, die nur nachts geht. Danach folgen weitere Aufträge rund um den Skunk Ape." },
      { type: "note", tone: "info", title: "Belohnung", text: "Die Guides nennen unterschiedliche Geldbeträge als Belohnung – deshalb geben wir hier noch keine Summe an." },
    ],
    publishedAt: "2026-11-20",
    sources: [
      { label: "Game8: Bigfoot Sighting Easter Egg", url: "https://game8.co/games/GTA-6/archives/638054" },
      { label: "GameSpot: GTA 6 Easter Eggs", url: "https://www.gamespot.com/articles/gta-6-easter-eggs-list-and-locations/" },
      { label: "Outputlag: Skunk Ape", url: "https://outputlag.com/guides/gta-6-skunk-ape-bigfoot/" },
      { label: "GamerFuzion: Skunk Ape und Kirk", url: "https://www.gamerfuzion.com/gta-6-bigfoot-skunk-ape-easter-egg/" },
    ],
  },
  {
    slug: "eier-auf-dem-funkturm",
    title: "Ostereier auf dem Funkturm",
    excerpt: "Auf dem höchsten Funkturm – bekannt aus dem ersten Trailer – liegt ein Nest mit echten Eiern: ein Easter Egg im wörtlichsten Sinn.",
    category: "easter-eggs",
    status: "verifiziert",
    spoiler: false,
    location: "Höchster Funkturm im Bezirk Vice-Dale (bei Vice City)",
    mapLocationId: "geheimnis-funkturm",
    blocks: [
      { type: "p", text: "Der große Funkturm aus dem ersten Trailer lässt sich besteigen. Oben wartet ein Nest voller Eier – Rockstars Witz zum Begriff „Easter Egg“." },
      { type: "ol", items: ["Fahr zum höchsten Funkturm im Bezirk Vice-Dale.", "Klettere nach oben – das dauert etwa sechs bis sieben Minuten.", "Oben findest du das Nest. Wirfst du ein Ei hinunter, landet es in einer kurzen Szene auf einer Windschutzscheibe."] },
    ],
    publishedAt: "2026-11-20",
    sources: [
      { label: "Kotaku: GTA 6 Launch Live Updates", url: "https://kotaku.com/live-updates-on-gta-6-the-biggest-launch-in-gaming-history-2000758030" },
      { label: "GameSpot: GTA 6 Has A Hilarious Riff On Easter Eggs", url: "https://www.gamespot.com/articles/gta-6-has-a-hilarious-riff-on-easter-eggs/" },
    ],
  },
  {
    slug: "ufo-entfuehrung-port-gellhorn",
    title: "UFO-Entführung bei Port Gellhorn",
    excerpt: "Nachts östlich von Port Gellhorn führt eine Spur in den Wald – dort entführt ein UFO gerade jemanden. Dafür gibt es eine versteckte Trophäe.",
    category: "geheimnisse",
    status: "verifiziert",
    spoiler: true,
    location: "Landstraßen östlich von Port Gellhorn, nachts",
    mapLocationId: "geheimnis-ufo",
    blocks: [
      { type: "ol", items: ["Fahr nachts – nach etwa 2 Uhr Spielzeit – über die Landstraßen östlich von Port Gellhorn.", "Achte auf ein Auto mit flackernden Lichtern am Straßenrand.", "Folge der Spur in den Wald: Dort wird gerade jemand von einem UFO entführt."] },
      { type: "note", tone: "info", title: "Trophäe", text: "Laut den Guides schaltet die Szene die versteckte Trophäe bzw. den Erfolg „The Truth Is Out There“ frei." },
    ],
    publishedAt: "2026-11-20",
    sources: [
      { label: "WikiGTAVI: Easter Eggs Day One", url: "https://www.wikigtavi.com/guides/gta-6-easter-eggs-secrets" },
      { label: "Leonida Verse: Easter Eggs", url: "https://leonidaverse.com/en/codex/gta-6-easter-eggs" },
    ],
  },
  {
    slug: "dexter-trinity-apartments",
    title: "Dexter-Anspielung: „Trinity Apartments“",
    excerpt: "Ein Wohnhaus in Vice City heißt „Trinity Apartments“ – eine Anspielung auf die Serie „Dexter“. Auf dem Dach liegen passende Werkzeuge.",
    category: "easter-eggs",
    status: "verifiziert",
    spoiler: false,
    location: "Vice City, Gegend Washington",
    blocks: [
      { type: "p", text: "Das Wohnhaus, das Fans schon aus den Trailern kannten, heißt im Spiel „Trinity Apartments“ – benannt nach einem der bekanntesten Gegenspieler aus der Serie „Dexter“, die in Miami spielt." },
      { type: "p", text: "Wer aufs Dach klettert, findet dort Werkzeuge, die an die Hauptfigur der Serie erinnern." },
    ],
    publishedAt: "2026-11-20",
    sources: [
      { label: "TheGamer: Dexter Easter Egg", url: "https://www.thegamer.com/gta-6-grand-theft-auto-dexter-show-reference-discovery/" },
      { label: "ComicBook: GTA 6 Easter Eggs after launch", url: "https://comicbook.com/gaming/list/5-most-exciting-gta-6-easter-eggs-players-have-found-after-launch-day/" },
    ],
  },
  {
    slug: "fast-and-furious-auto",
    title: "Das grüne Sportauto aus „The Fast and the Furious“",
    excerpt: "In der Garage einer Villa steht ein Nachbau des grünen 90er-Sportwagens mit Neonlicht, den Paul Walker im ersten „Fast & Furious“-Film fuhr.",
    category: "seltene-fahrzeuge",
    status: "unbestaetigt",
    spoiler: false,
    location: "Garage einer Villa in Vice City (genaue Lage noch nicht sicher)",
    blocks: [
      { type: "p", text: "Laut Spielern steht in der Garage einer Villa ein grüner Sportwagen aus den 90ern mit Neon-Unterbodenbeleuchtung – eine Verbeugung vor Paul Walkers Auto aus „The Fast and the Furious“ (2001)." },
      { type: "note", tone: "research", title: "Noch nicht sicher", text: "Den genauen Ort beschreiben die Quellen unterschiedlich. Hast du das Auto gefunden? Schreib uns in der Community, wo genau." },
    ],
    publishedAt: "2026-11-20",
    sources: [
      { label: "ComicBook: GTA 6 Easter Eggs after launch", url: "https://comicbook.com/gaming/list/5-most-exciting-gta-6-easter-eggs-players-have-found-after-launch-day/" },
      { label: "Leonida Verse: Easter Eggs", url: "https://leonidaverse.com/en/codex/gta-6-easter-eggs" },
    ],
  },
  {
    slug: "jetski-hund",
    title: "Der Jetski-Hund rettet dich",
    excerpt: "Schwimmst du lange draußen im Meer, kommt dir ein Hund mit Schwimmweste auf einem Jetski zu Hilfe.",
    category: "easter-eggs",
    status: "unbestaetigt",
    spoiler: false,
    location: "Offenes Meer",
    blocks: [
      { type: "ol", items: ["Schwimm eine Weile weit draußen im Meer.", "Hör auf Hundegebell.", "Ein Hund mit Schwimmweste kommt auf einem Jetski angefahren und bringt dich zurück an Land."] },
      { type: "note", tone: "research", title: "Noch nicht sicher", text: "Dieses Easter Egg ging in Videos viral, ist aber erst von wenigen Quellen beschrieben. Hast du es erlebt? Erzähl es in der Community." },
    ],
    publishedAt: "2026-11-20",
    sources: [
      { label: "ComicBook: GTA 6 Easter Eggs after launch", url: "https://comicbook.com/gaming/list/5-most-exciting-gta-6-easter-eggs-players-have-found-after-launch-day/" },
      { label: "ViralGTA6 (Video-Übersicht)", url: "https://viralgta6.com/" },
    ],
  },
  {
    slug: "sammelkarten",
    title: "Sammelkarten: 18 Sets",
    excerpt: "In ganz Leonida liegen Sammelkarten. Es gibt 18 Sets mit zusammen 480 Karten – gefundene Karten kannst du im Pfandhaus verkaufen.",
    category: "sammelobjekte",
    status: "verifiziert",
    spoiler: false,
    location: "Überall in Leonida",
    blocks: [
      { type: "ul", items: ["18 Sets mit zusammen 480 Karten.", "Jede gefundene Karte kannst du im Pfandhaus verkaufen.", "Seltene Karten bringen deutlich mehr Geld als häufige."] },
      { type: "p", text: "Wir tragen Fundorte nach und nach ein – sobald sie geprüft sind." },
    ],
    publishedAt: "2026-11-20",
    sources: [
      { label: "Red Bull: GTA 6 Collectible Card guide", url: "https://www.redbull.com/int-en/gta-6-collectible-card-sets" },
      { label: "Game8: All Collectible Cards", url: "https://game8.co/games/GTA-6/archives/638661" },
      { label: "MetaForge: Collectible Cards", url: "https://metaforge.app/gta-6/gta-6-collectible-cards-all-sets" },
    ],
  },
  {
    slug: "meteoriten",
    title: "Meteoriten-Stücke",
    excerpt: "Verstreut in Leonida liegen Stücke eines Meteoriten – oft gut versteckt an Felsen, Türmen oder auf kleinen Inseln.",
    category: "sammelobjekte",
    status: "verifiziert",
    spoiler: false,
    location: "Verstreut in Leonida",
    blocks: [{ type: "p", text: "Meteoriten-Stücke sind eigene Sammelobjekte. Genaue Fundorte tragen wir ein, sobald sie geprüft sind." }],
    publishedAt: "2026-11-20",
    sources: [
      { label: "The Big Lead: GTA 6 collectibles guide", url: "https://www.thebiglead.com/gta-6-collectibles-guide-cards-styles-meteorite-chunks-landmark-scans/" },
      { label: "MeowDB: Collectibles", url: "https://meowdb.com/gta6/collectibles" },
    ],
  },
  {
    slug: "wahrzeichen-scannen",
    title: "Wahrzeichen scannen (WAiNK)",
    excerpt: "Mit dem Handy scannst du Wahrzeichen, Kuriositäten und Skulpturen in Leonida – sie zählen als eigene Sammlung.",
    category: "sammelobjekte",
    status: "verifiziert",
    spoiler: false,
    location: "Überall in Leonida",
    blocks: [{ type: "p", text: "Die Scans laufen über „WAiNK“. Wie viele es insgesamt sind, geben die Guides noch unterschiedlich an – wir tragen die Zahl ein, sobald sie sicher ist." }],
    publishedAt: "2026-11-20",
    sources: [
      { label: "games.gg: Collectible Locations", url: "https://games.gg/grand-theft-auto-vi/guides/grand-theft-auto-6-collectible-locations-what-to-know/" },
      { label: "The Big Lead: GTA 6 collectibles guide", url: "https://www.thebiglead.com/gta-6-collectibles-guide-cards-styles-meteorite-chunks-landmark-scans/" },
    ],
  },
];
