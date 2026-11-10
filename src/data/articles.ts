import type { Article } from "@/types/content";

/**
 * Demo-Ratgeber.
 *
 * WICHTIG: Diese Artikel enthalten bewusst KEINE erfundenen GTA-6-Spielmechaniken.
 * Sie bestehen aus allgemeinen, spielunabhängigen Empfehlungen sowie klar
 * markierten Platzhaltern („Recherchebedarf“). Echte Inhalte werden erst nach
 * Prüfung durch die Redaktion ergänzt und dann auf „verifiziert“ gesetzt.
 */
export const articles: Article[] = [
  {
    slug: "erste-schritte-in-einer-neuen-open-world",
    title: "Erste Schritte: So startest du entspannt in eine neue Open World",
    excerpt:
      "Allgemeine Einsteiger-Tipps, die in fast jedem Open-World-Spiel helfen – ohne Spoiler und ohne Spekulationen über GTA 6.",
    category: "anfaenger",
    publishedAt: "2026-10-28",
    author: "Redaktion 5-Sterne-Kompass",
    status: "demo",
    popular: true,
    tags: ["Einstieg", "Orientierung", "Spoilerfrei"],
    blocks: [
      {
        type: "note",
        tone: "info",
        title: "Demo-Artikel",
        text: "Dieser Ratgeber enthält allgemeine Spieltipps. Konkrete GTA-6-Inhalte ergänzen wir erst, wenn sie im Spiel überprüft wurden.",
      },
      { type: "h2", id: "ruhig-anfangen", text: "Ruhig anfangen statt alles auf einmal" },
      {
        type: "p",
        text: "Große Spielwelten verleiten dazu, sofort jede Ecke abzuklappern. Für den Einstieg lohnt es sich meist, zuerst den ersten Story-Abschnitt zu spielen. So lernst du Steuerung und Grundsysteme kennen, bevor du dich in Nebenaufgaben verlierst.",
      },
      { type: "h2", id: "einstellungen", text: "Einstellungen vor dem ersten Abend prüfen" },
      {
        type: "ul",
        items: [
          "Untertitel und Textgröße so einstellen, dass du sie bequem lesen kannst.",
          "Kamera-Empfindlichkeit anpassen, bevor du dich an falsche Werte gewöhnst.",
          "Barrierefreiheits-Optionen ansehen – viele davon sind für alle Spieler praktisch.",
        ],
      },
      { type: "h2", id: "speichern", text: "Speicherstände sinnvoll nutzen" },
      {
        type: "p",
        text: "Wenn ein Spiel mehrere Speicherplätze anbietet, lohnt es sich, vor wichtigen Entscheidungen einen zusätzlichen Spielstand anzulegen. So kannst du später andere Wege ausprobieren.",
      },
      {
        type: "note",
        tone: "research",
        title: "Recherchebedarf",
        text: "Wie Speichern, Autosave und Speicherplätze in GTA 6 funktionieren, ist noch zu prüfen. Dieser Abschnitt wird nach Release ergänzt.",
      },
      { type: "h2", id: "spoiler", text: "Spoiler bewusst vermeiden" },
      {
        type: "p",
        text: "Gerade in den ersten Tagen nach einem Release kursieren viele Spoiler. Auf dem 5-Sterne-Kompass sind Missions- und Story-Inhalte deshalb immer mit einem Spoiler-Hinweis gekennzeichnet.",
      },
    ],
  },
  {
    slug: "fahrzeuge-grundlagen-checkliste",
    title: "Fahrzeug-Grundlagen: Eine Checkliste für sicheres Fahren in Spielen",
    excerpt:
      "Bremsen, Kurven, Kamera: allgemeine Fahrtipps für Rennspiel-Neulinge – GTA-6-spezifische Details folgen nach Prüfung.",
    category: "fahrzeuge",
    publishedAt: "2026-10-30",
    author: "Redaktion 5-Sterne-Kompass",
    status: "demo",
    popular: true,
    tags: ["Fahren", "Steuerung"],
    blocks: [
      {
        type: "note",
        tone: "info",
        title: "Demo-Artikel",
        text: "Allgemeine Tipps zum Fahren in Videospielen. Es werden keine Fahrzeugnamen oder Werte aus GTA 6 behauptet.",
      },
      { type: "h2", id: "vor-der-kurve-bremsen", text: "Vor der Kurve bremsen, nicht in der Kurve" },
      {
        type: "p",
        text: "In fast allen Fahrmodellen gilt: Wer vor der Kurve abbremst und am Kurvenausgang beschleunigt, bleibt deutlich kontrollierter als mit Vollgas in die Kurve.",
      },
      { type: "h2", id: "kamera", text: "Kamera und Sicht" },
      {
        type: "ul",
        items: [
          "Probiere verschiedene Kamerapositionen aus – weiter hinten siehst du mehr vom Verkehr.",
          "Falls verfügbar: Kamera-Autozentrierung an- oder ausschalten, je nach Vorliebe.",
          "Bei Nachtfahrten Helligkeit und Kontrast der Anzeige prüfen.",
        ],
      },
      { type: "h2", id: "gta6-details", text: "GTA-6-spezifische Details" },
      {
        type: "note",
        tone: "research",
        title: "Recherchebedarf",
        text: "Fahrzeugklassen, Tuning-Möglichkeiten und Fahrverhalten in GTA 6 sind noch nicht durch die Redaktion geprüft.",
      },
    ],
  },
  {
    slug: "geld-sinnvoll-planen",
    title: "Geld im Spiel sinnvoll planen: Allgemeine Grundsätze",
    excerpt:
      "Warum es sich lohnt, Ausgaben in Spielen zu planen – allgemeine Prinzipien statt erfundener Geld-Tricks.",
    category: "geld",
    publishedAt: "2026-11-02",
    author: "Redaktion 5-Sterne-Kompass",
    status: "demo",
    popular: true,
    tags: ["Wirtschaft", "Planung"],
    blocks: [
      {
        type: "note",
        tone: "warning",
        title: "Keine Geld-Glitches",
        text: "Wir veröffentlichen keine Anleitungen zu Exploits, Cheats in Online-Modi oder Methoden, die gegen Nutzungsbedingungen verstoßen.",
      },
      { type: "h2", id: "prioritaeten", text: "Prioritäten setzen" },
      {
        type: "p",
        text: "In vielen Spielen gibt es Anschaffungen, die dauerhaft helfen, und solche, die vor allem gut aussehen. Es lohnt sich, zuerst in Dinge zu investieren, die dir das Weiterspielen erleichtern.",
      },
      { type: "h2", id: "ueberblick", text: "Überblick behalten" },
      {
        type: "ol",
        items: [
          "Notiere dir größere Ziele, auf die du sparen möchtest.",
          "Vergleiche Preise, bevor du kaufst – falls das Spiel unterschiedliche Händler bietet.",
          "Plane einen Puffer für unerwartete Ausgaben ein.",
        ],
      },
      {
        type: "note",
        tone: "research",
        title: "Recherchebedarf",
        text: "Wie das Wirtschaftssystem in GTA 6 aufgebaut ist, wird nach Release recherchiert und hier ergänzt.",
      },
    ],
  },
  {
    slug: "einstellungen-komfort-und-barrierefreiheit",
    title: "Komfort & Barrierefreiheit: Welche Einstellungen du kennen solltest",
    excerpt:
      "Untertitel, Farbfilter, Steuerungsbelegung: allgemeine Hinweise zu Optionen, die das Spielen angenehmer machen.",
    category: "einstellungen",
    publishedAt: "2026-11-04",
    author: "Redaktion 5-Sterne-Kompass",
    status: "demo",
    tags: ["Barrierefreiheit", "Optionen"],
    blocks: [
      { type: "h2", id: "warum", text: "Warum Einstellungen so wichtig sind" },
      {
        type: "p",
        text: "Gute Einstellungen sind kein Luxus. Sie helfen, länger entspannt zu spielen, und machen Spiele für mehr Menschen zugänglich.",
      },
      { type: "h2", id: "typische-optionen", text: "Typische Optionen in modernen Spielen" },
      {
        type: "ul",
        items: [
          "Untertitel mit Hintergrund und anpassbarer Größe",
          "Freie Tastenbelegung bzw. Controller-Belegung",
          "Modi für Farbsehschwäche",
          "Optionen zur Reduzierung von Kamerawackeln und Bewegungsunschärfe",
        ],
      },
      {
        type: "note",
        tone: "research",
        title: "Recherchebedarf",
        text: "Welche dieser Optionen GTA 6 tatsächlich bietet, prüfen wir nach Release und kennzeichnen das Ergebnis als „verifiziert“.",
      },
    ],
  },
  {
    slug: "spielwelt-was-offiziell-bekannt-ist",
    title: "Die Spielwelt: Was laut offiziellen Trailern bekannt ist",
    excerpt:
      "Leonida, Vice City, Lucia und Jason – eine kurze Übersicht über Angaben aus offiziellen Rockstar-Trailern, mit Quellenhinweis.",
    category: "charaktere",
    publishedAt: "2026-11-06",
    author: "Redaktion 5-Sterne-Kompass",
    status: "unbestaetigt",
    popular: true,
    tags: ["Welt", "Charaktere", "Offizielle Quellen"],
    blocks: [
      {
        type: "note",
        tone: "warning",
        title: "Stand bitte prüfen",
        text: "Die folgenden Angaben stammen aus offiziellen Trailern und Ankündigungen von Rockstar Games. Die Redaktion hat sie noch nicht abschließend gegen den aktuellen Stand geprüft – daher Status „unbestätigt“.",
      },
      { type: "h2", id: "schauplatz", text: "Schauplatz" },
      {
        type: "p",
        text: "In den offiziellen Trailern wird der fiktive Bundesstaat Leonida mit der Stadt Vice City gezeigt. Weitere Details zu Regionen und Orten ergänzen wir erst nach Prüfung.",
      },
      { type: "h2", id: "hauptfiguren", text: "Hauptfiguren" },
      {
        type: "p",
        text: "Die Trailer stellen die Figuren Lucia und Jason in den Mittelpunkt. Hintergründe zu Geschichte und Spielweise werden wir nicht spekulativ ergänzen.",
      },
      { type: "h2", id: "quellen", text: "Quellen" },
      {
        type: "p",
        text: "Offizielle Informationen findest du ausschließlich auf den Kanälen von Rockstar Games. Der 5-Sterne-Kompass ist ein unabhängiges Fanprojekt und steht in keiner Verbindung zu Rockstar Games oder Take-Two Interactive.",
      },
    ],
  },
  {
    slug: "fortgeschritten-routinen-und-ziele",
    title: "Fortgeschritten: Eigene Ziele und Routinen für lange Spielzeiten",
    excerpt:
      "Wie du auch nach dutzenden Stunden motiviert bleibst – allgemeine Strategien für große Open-World-Spiele.",
    category: "fortgeschritten",
    publishedAt: "2026-11-07",
    author: "Redaktion 5-Sterne-Kompass",
    status: "demo",
    tags: ["Motivation", "Planung"],
    blocks: [
      { type: "h2", id: "ziele", text: "Eigene Ziele setzen" },
      {
        type: "p",
        text: "Viele Spieler setzen sich eigene Ziele: einen bestimmten Bereich vollständig erkunden, eine Sammlung abschließen oder eine Aufgabe mit besonderer Spielweise meistern.",
      },
      { type: "h2", id: "notizen", text: "Notizen statt Frust" },
      {
        type: "p",
        text: "Halte Fundorte und offene Aufgaben schriftlich fest. Unsere interaktive Karte soll das künftig erleichtern – mit eigenen Markierungen für angemeldete Nutzer.",
      },
      {
        type: "note",
        tone: "info",
        title: "Demo-Artikel",
        text: "Dieser Text enthält keine GTA-6-spezifischen Spielinformationen.",
      },
    ],
  },
  {
    slug: "gameplay-wie-wir-informationen-pruefen",
    title: "Gameplay-Infos: So prüfen wir Informationen, bevor wir sie veröffentlichen",
    excerpt:
      "Verifiziert, unbestätigt, Demo: Was unsere Statuskennzeichnungen bedeuten und warum wir keine Gerüchte als Fakten verkaufen.",
    category: "gameplay",
    publishedAt: "2026-11-08",
    author: "Redaktion 5-Sterne-Kompass",
    status: "verifiziert",
    tags: ["Redaktion", "Transparenz"],
    blocks: [
      { type: "h2", id: "status", text: "Die drei Statuskennzeichnungen" },
      {
        type: "ul",
        items: [
          "Verifiziert: durch offizielle Quelle belegt oder von der Redaktion selbst im Spiel geprüft.",
          "Unbestätigt: Hinweise aus der Community oder Angaben, deren aktueller Stand noch geprüft werden muss.",
          "Demo: Beispielinhalt, der die Funktionen der Website zeigt, aber keine echte Spielinformation enthält.",
        ],
      },
      { type: "h2", id: "warum", text: "Warum das wichtig ist" },
      {
        type: "p",
        text: "Rund um große Spiele kursieren viele Gerüchte. Wir möchten, dass du jederzeit erkennst, wie verlässlich eine Information ist.",
      },
      { type: "h2", id: "mitmachen", text: "Mitmachen" },
      {
        type: "p",
        text: "Du hast einen Fehler entdeckt oder kannst eine Information belegen? Nutze die Community oder unsere Kontaktseite – jede Rückmeldung hilft.",
      },
    ],
  },
];
