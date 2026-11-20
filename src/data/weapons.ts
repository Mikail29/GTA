import type { Category, WorldItem } from "@/types/content";

/**
 * Waffen in GTA 6 (seit dem Release am 19.11.2026).
 * Regeln: nur geprüfte Fakten (mindestens zwei unabhängige Quellen oder offizielle Angabe von Rockstar),
 * in eigenen Worten. Bewusst keine Preise, Schadenswerte oder Tabellen fremder Seiten (Datenbankschutz,
 * außerdem ändern sich Werte mit Updates). Quellen nur intern im Feld sources.
 */
export const weaponCategories: Category[] = [
  { slug: "pistolen", name: "Pistolen & Revolver", description: "Kleine Waffen für eine Hand.", icon: "crosshair", accent: "pink" },
  { slug: "schrotflinten", name: "Schrotflinten", description: "Stark auf kurze Entfernung.", icon: "flame", accent: "sunset" },
  { slug: "gewehre", name: "Gewehre", description: "Langwaffen für mittlere und weite Entfernungen.", icon: "target", accent: "teal" },
  { slug: "laeden", name: "Waffenläden", description: "Wo du Waffen und Munition kaufst.", icon: "building", accent: "violet" },
];

const editionen = { label: "Rockstar Games: Grand Theft Auto VI Editionen", url: "https://www.rockstargames.com/VI/editions" };
const gearUp = [
  { label: "GTA BOOM: Gear Up Walkthrough", url: "https://www.gtaboom.com/gta-6-gear-up-mission-walkthrough-26a2" },
  { label: "Video Games Chronicle: Gear Up Mission Walkthrough", url: "https://www.videogameschronicle.com/guide/gta-6-gear-up-mission-walkthrough/" },
  { label: "Game8: Gear Up Walkthrough", url: "https://game8.co/games/GTA-6/archives/638530" },
];
const chucks = [
  { label: "Leonida Insights: Chuck's Tackle & Shot", url: "https://leonidainsights.com/en/world/places/chucks-tackle-and-shot/" },
  { label: "The Phrasemaker: How to get weapons in GTA 6", url: "https://thephrasemaker.com/2026/11/19/how-to-get-weapons-in-gta-6-best-weapons-list/" },
];

export const weapons: WorldItem[] = [
  {
    slug: "girardi-es9",
    name: "Girardi ES9",
    category: "pistolen",
    art: "waffe-pistole",
    text: "Jasons Pistole. In der Ultimate Edition gibt es eine eigene Version mit Gravur – also mit eingeritzten Verzierungen.",
    where: "Jason · Gravur-Version nur in der Ultimate Edition",
    status: "verifiziert",
    sources: [
      editionen,
      { label: "PC Gamer: GTA 6 weapons list", url: "https://pcgamer.com/games/grand-theft-auto/gta-6-weapons-list/" },
      { label: "GTA BOOM: GTA 6 Weapons", url: "https://www.gtaboom.com/gta-6-weapons-6e4d" },
      { label: "Gfinity: GTA 6 weapons guide", url: "https://www.gfinityesports.com/article/gta-6-weapons-guide-every-confirmed-gun-explosive-and-melee-item" },
    ],
  },
  {
    slug: "klose-k17",
    name: "Klose K17",
    category: "pistolen",
    art: "waffe-pistole-kompakt",
    text: "Lucias Pistole. Auch für sie gibt es in der Ultimate Edition eine eigene Version. Laut den Guides kannst du die K17 auch im Waffenladen kaufen.",
    where: "Lucia · Ultimate-Version · laut Guides auch bei Chuck's Tackle & Shot",
    status: "verifiziert",
    sources: [
      editionen,
      { label: "PC Gamer: GTA 6 weapons list", url: "https://pcgamer.com/games/grand-theft-auto/gta-6-weapons-list/" },
      { label: "games.gg: Confirmed guns", url: "https://games.gg/news/gta-6-confirmed-guns-trailers-screenshots/" },
      ...chucks,
    ],
  },
  {
    slug: "hawk-little-morgan",
    name: "Hawk & Little Morgan",
    category: "pistolen",
    art: "waffe-revolver",
    text: "Ein großer Revolver – das ist eine Handwaffe, bei der die Patronen in einer drehbaren Trommel stecken. Die Ultimate Edition enthält eigene Versionen für Jason und Lucia.",
    where: "Ultimate Edition",
    status: "verifiziert",
    sources: [
      editionen,
      { label: "Screen Rant: All GTA 6 weapons confirmed", url: "https://screenrant.com/gta-6-all-weapons-confirmed/" },
      { label: "Top Gear: GTA 6 Ultimate Edition content", url: "https://www.topgear.com/car-news/gaming/gta-6-reveals-its-ultimate-edition-content-and-vintage-vice-city-themed-preorder" },
    ],
  },
  {
    slug: "moreland-850",
    name: "Fortune & Son Moreland 850",
    category: "schrotflinten",
    art: "waffe-pumpgun",
    text: "Eine Pump-Schrotflinte: Nach jedem Schuss lädt man sie nach, indem man den vorderen Griff vor- und zurückschiebt. In der Mission „Gear Up“ bekommst du sie im Waffenladen günstiger.",
    where: "Chuck's Tackle & Shot in Key Lento",
    status: "verifiziert",
    mapLocationId: "fundort-chucks",
    sources: [...gearUp, { label: "Nerdschalk: Fortune & Son Moreland 850", url: "https://nerdschalk.com/gta-6-fortune-son-moreland-850" }],
  },
  {
    slug: "shrewsbury-drifter",
    name: "Shrewsbury Drifter",
    category: "schrotflinten",
    art: "waffe-doppelflinte",
    text: "Eine doppelläufige Schrotflinte – sie hat zwei Läufe nebeneinander.",
    where: "Laut Guides bei Chuck's Tackle & Shot",
    status: "unbestaetigt",
    sources: chucks,
  },
  {
    slug: "shrewsbury-hobo",
    name: "Shrewsbury Hobo",
    category: "schrotflinten",
    art: "waffe-abgesaegt",
    text: "Eine abgesägte Schrotflinte: Läufe und Kolben sind gekürzt, dadurch ist sie kurz und handlich.",
    where: "Laut Guides bei Chuck's Tackle & Shot",
    status: "unbestaetigt",
    sources: chucks,
  },
  {
    slug: "hawk-little-mediator",
    name: "Hawk & Little Mediator",
    category: "gewehre",
    art: "waffe-gewehr",
    text: "Ein Gewehr, das es in der Mission „Gear Up“ im Waffenladen günstiger gibt. Neben der Moreland-Schrotflinte ist es eine der beiden Langwaffen, die du dort kaufen kannst.",
    where: "Chuck's Tackle & Shot in Key Lento",
    status: "verifiziert",
    mapLocationId: "fundort-chucks",
    sources: [...gearUp, ...chucks],
  },
  {
    slug: "duke-556",
    name: "Duke 556",
    category: "gewehre",
    art: "waffe-sturmgewehr",
    text: "Ein Sturmgewehr – es kann viele Schüsse schnell hintereinander abgeben. Wo und ab wann du es kaufen kannst, beschreiben die Guides noch unterschiedlich.",
    where: "Wird später im Spiel freigeschaltet",
    status: "verifiziert",
    sources: [
      { label: "Dexerto: Duke 556", url: "https://www.dexerto.com/wikis/gta-6/weapons/assault-rifles/duke-556/" },
      { label: "MeowDB: Duke 556 Assault Rifle", url: "https://meowdb.com/gta6/weapons/duke-556-assault-rifle" },
      { label: "Screen Rant: All GTA 6 weapons confirmed", url: "https://screenrant.com/gta-6-all-weapons-confirmed/" },
    ],
  },
  {
    slug: "laird-350",
    name: "Fortune & Son Laird 350",
    category: "gewehre",
    art: "waffe-scharfschuetze",
    text: "Ein Scharfschützengewehr mit Zielfernrohr – damit triffst du auch weit entfernte Ziele.",
    where: "Laut Guides bei Chuck's Tackle & Shot",
    status: "unbestaetigt",
    sources: chucks,
  },
  {
    slug: "chucks-tackle-and-shot",
    name: "Chuck's Tackle & Shot",
    category: "laeden",
    icon: "crosshair",
    text: "Ein Laden für Angelzubehör und Waffen in Key Lento. Hier spielt die Mission „Gear Up“ – danach kannst du hier jederzeit Waffen und Munition kaufen.",
    where: "Key Lento",
    status: "verifiziert",
    mapLocationId: "fundort-chucks",
    sources: [...gearUp, chucks[0]],
  },
];
