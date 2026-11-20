import type { Category, WorldItem } from "@/types/content";

/**
 * Fahrzeuge in GTA 6 (seit dem Release am 19.11.2026).
 * Regeln: nur geprüfte Fakten (mindestens zwei unabhängige Quellen oder offizielle Angabe von Rockstar),
 * in eigenen Worten. Keine Preise, Werte-Tabellen oder Listen fremder Seiten übernehmen (Datenbankschutz).
 * Quellen nur intern im Feld sources – sie werden auf der Website nicht angezeigt.
 */
export const vehicleCategories: Category[] = [
  { slug: "story", name: "Aus der Geschichte", description: "Fahrzeuge, die dir in den Missionen begegnen.", icon: "scroll", accent: "pink" },
  { slug: "bonus", name: "Bonus-Fahrzeuge", description: "Extras aus der Ultimate Edition und dem Vorbesteller-Bonus.", icon: "gem", accent: "violet" },
  { slug: "werkstaetten", name: "Werkstätten & Lackierereien", description: "Wo du dein Auto reparieren, neu lackieren oder umbauen lässt.", icon: "wrench", accent: "teal" },
];

const editionen = { label: "Rockstar Games: Grand Theft Auto VI Editionen", url: "https://www.rockstargames.com/VI/editions" };

export const vehicles: WorldItem[] = [
  {
    slug: "vapid-ganado",
    name: "Vapid Ganado",
    category: "story",
    art: "fahrzeug-ganado",
    text: "Jasons altes Auto aus den 70ern: ein flacher Wagen mit offener Ladefläche hinten. In der Mission „Just a Scratch“ lässt du ihn bei Joey zum ersten Mal herrichten und neu lackieren.",
    where: "Jasons erstes Auto – von Anfang an dabei",
    status: "verifiziert",
    sources: [
      { label: "PC Gamer: GTA 6 cars list", url: "https://www.pcgamer.com/games/grand-theft-auto/gta-6-cars-list/" },
      { label: "MeowDB: Vapid Ganado", url: "https://meowdb.com/gta6/vehicles/vapid-ganado" },
      { label: "Dexerto: Vapid Ganado", url: "https://www.dexerto.com/wikis/gta-6/vehicles/cars/vapid-ganado/" },
      { label: "GTA BOOM: Just a Scratch", url: "https://www.gtaboom.com/gta-6-just-a-scratch-mission-walkthrough-da82" },
    ],
  },
  {
    slug: "imponte-phoenix",
    name: "Imponte Phoenix",
    category: "story",
    art: "fahrzeug-phoenix",
    text: "Ein rotes Muscle-Car – so nennt man amerikanische Sportwagen mit großem, starkem Motor. In der Mission „Unwanted Attention“ holst du es für Brian vom Abschlepphof.",
    where: "Mission „Unwanted Attention“",
    status: "verifiziert",
    sources: [
      { label: "Alcast HQ: Unwanted Attention", url: "https://alcasthq.com/gta-6-unwanted-attention/" },
      { label: "Outputlag: Unwanted Attention", url: "https://outputlag.com/guides/gta-6-unwanted-attention-walkthrough/" },
      { label: "games.gg: Unwanted Attention", url: "https://games.gg/grand-theft-auto-vi/guides/gta-6-unwanted-attention-mission/" },
    ],
  },
  {
    slug: "vapid-stanier-55",
    name: "Vapid Stanier ’55",
    category: "bonus",
    art: "fahrzeug-stanier",
    text: "Eine Limousine im Stil der 50er-Jahre. Sie gehört zum „Vintage Vice City Pack“ – zusammen mit einer eigenen Garage, Outfits, Frisuren und einem Waffen-Muster.",
    where: "Vorbesteller-Bonus: wer GTA 6 vor dem 20. November gekauft hat",
    status: "verifiziert",
    sources: [
      editionen,
      { label: "Rockstar Support: Platforms, Editions, and Versions", url: "https://support.rockstargames.com/articles/4QfG4FmZCf5W1gS8jy4UVT/grand-theft-auto-vi-platform-editions-and-versions" },
      { label: "Gfinity: Vintage Vice City Pack", url: "https://www.gfinityesports.com/article/how-to-get-gta-6-vintage-vice-city-pack-and-whats-included" },
    ],
  },
  {
    slug: "grotti-cheetah-95",
    name: "Grotti Cheetah ’95",
    category: "bonus",
    art: "fahrzeug-cheetah",
    text: "Ein flacher Supersportwagen aus der Mitte der 90er mit schlichter Lackierung im Retro-Stil (also im Look vergangener Jahrzehnte).",
    where: "Nur in der Ultimate Edition",
    status: "verifiziert",
    sources: [
      editionen,
      { label: "Top Gear: GTA 6 Ultimate Edition content", url: "https://www.topgear.com/car-news/gaming/gta-6-reveals-its-ultimate-edition-content-and-vintage-vice-city-themed-preorder" },
      { label: "Video Games Chronicle: Ultimate Edition", url: "https://www.videogameschronicle.com/news/rockstar-confirms-grand-theft-auto-6-ultimate-edition-and-pre-order-bonuses-but-still-no-price/" },
    ],
  },
  {
    slug: "ganado-retro-umbau",
    name: "Ganado-Umbau im Retro-Look",
    category: "bonus",
    art: "fahrzeug-ganado-retro",
    text: "Ein exklusiver Umbau-Satz für Jasons Ganado: Damit bekommt das Auto einen auffälligen Retro-Look.",
    where: "Nur in der Ultimate Edition",
    status: "verifiziert",
    sources: [editionen, { label: "Top Gear: GTA 6 Ultimate Edition content", url: "https://www.topgear.com/car-news/gaming/gta-6-reveals-its-ultimate-edition-content-and-vintage-vice-city-themed-preorder" }],
  },
  {
    slug: "jasons-unterschlupf-fahrzeuge",
    name: "Fahrzeuge für Jasons Unterschlupf",
    category: "bonus",
    art: "fahrzeug-motorrad",
    text: "Rockstar nennt eigene Fahrzeuge, die direkt an Jasons Unterschlupf (seinem Zuhause im Spiel) bereitstehen. Laut den Guides sind das ein Geländemotorrad im Tarn-Look und ein Kajak.",
    where: "Nur in der Ultimate Edition",
    status: "verifiziert",
    sources: [
      editionen,
      { label: "games.gg: Ultimate Edition – everything included", url: "https://games.gg/grand-theft-auto-vi/guides/gta-6-ultimate-edition-everything-included/" },
      { label: "Insider Gaming: Ultimate Edition", url: "https://insider-gaming.com/everything-included-in-gta-6-ultimate-edition-price/" },
    ],
  },
  {
    slug: "coastal-auto-care",
    name: "Coastal Auto Care",
    category: "werkstaetten",
    icon: "wrench",
    text: "Die Werkstatt von Joey. Hier richtest du in „Just a Scratch“ Jasons Ganado her. Danach hilft dir Joey auch übers Handy – bei Reparaturen und beim Abschleppen.",
    where: "Freigeschaltet mit der Mission „Just a Scratch“",
    status: "verifiziert",
    sources: [
      { label: "GTA BOOM: Just a Scratch", url: "https://www.gtaboom.com/gta-6-just-a-scratch-mission-walkthrough-da82" },
      { label: "PowerPyx: Just a Scratch", url: "https://www.powerpyx.com/gta-6-just-a-scratch-fix-your-car-walkthrough/" },
    ],
  },
  {
    slug: "pay-n-spray",
    name: "Pay ’n’ Spray",
    category: "werkstaetten",
    icon: "sparkles",
    text: "Eine Lackiererei: Hier bekommt dein Auto schnell eine neue Farbe. In der Mission „Unwanted Attention“ musst du den gestohlenen Phoenix hier umlackieren lassen.",
    where: "Wird in „Unwanted Attention“ zum ersten Mal gebraucht",
    status: "verifiziert",
    sources: [
      { label: "Alcast HQ: Unwanted Attention", url: "https://alcasthq.com/gta-6-unwanted-attention/" },
      { label: "MetaForge: Unwanted Attention", url: "https://metaforge.app/gta-6/gta-6-unwanted-attention-walkthrough" },
    ],
  },
  {
    slug: "rideout-customs",
    name: "Rideout Customs",
    category: "werkstaetten",
    icon: "settings",
    text: "Eine Tuning-Werkstatt: Hier kannst du dein Fahrzeug umbauen und verschönern. Sie gehört zu den Extras der Ultimate Edition.",
    where: "Nur in der Ultimate Edition",
    status: "unbestaetigt",
    sources: [editionen, { label: "games.gg: Ultimate Edition – everything included", url: "https://games.gg/grand-theft-auto-vi/guides/gta-6-ultimate-edition-everything-included/" }],
  },
];
