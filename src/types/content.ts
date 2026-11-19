/**
 * Zentrale Inhaltstypen des 5-Sterne-Kompass.
 * Die Strukturen entsprechen den Tabellen der Supabase-Migration,
 * damit statische Demo-Daten später 1:1 durch Datenbankdaten ersetzt werden können.
 */

/** Verifizierungsstatus einer Information. */
export type VerificationStatus =
  /** Durch offizielle Quelle oder eigene Prüfung im Spiel bestätigt. */
  | "verifiziert"
  /** Gerücht, Community-Hinweis oder noch nicht geprüft. */
  | "unbestaetigt"
  /** Reiner Beispiel-/Platzhalterinhalt ohne echte Spielinformation. */
  | "demo";

/** Strukturierte Inhaltsblöcke – bewusst kein HTML, um XSS auszuschließen. */
export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; tone: "info" | "warning" | "research"; title?: string; text: string };

export type IconName =
  | "lightbulb"
  | "map"
  | "target"
  | "key"
  | "users"
  | "newspaper"
  | "car"
  | "crosshair"
  | "wallet"
  | "gamepad"
  | "user"
  | "settings"
  | "rocket"
  | "sparkles"
  | "gem"
  | "trophy"
  | "help"
  | "wrench"
  | "scroll"
  | "mappin"
  | "palm"
  | "waves"
  | "sunset"
  | "building"
  | "plane"
  | "anchor"
  | "flame"
  | "eye"
  | "star"
  | "shield"
  | "heart"
  | "compass"
  | "shapes"
  | "zap"
  | "cctv"
  | "shirt"
  | "landmark"
  | "drama"
  | "hit"
  | "wind"
  | "gauge"
  | "mountain"
  | "factory";

/** Farbschema für Platzhalter-Vorschaubilder. */
export type Accent = "pink" | "teal" | "violet" | "sunset";

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: IconName;
  accent: Accent;
}

export type MissionDifficulty = "leicht" | "mittel" | "schwer";

export interface MissionStep {
  title: string;
  text: string;
}

export interface Mission {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  difficulty: MissionDifficulty;
  status: VerificationStatus;
  /** Wie stark die Seite die Handlung verrät. */
  spoiler: "keine" | "leicht" | "stark";
  estimatedMinutes?: number;
  requirements: string[];
  steps: MissionStep[];
  tips: string[];
  related: string[];
  publishedAt: string;
  /** Quellen für die Fakten (für „verifiziert“ mindestens zwei unabhängige). */
  sources?: { label: string; url: string }[];
}

export interface Secret {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  status: VerificationStatus;
  spoiler: boolean;
  /** Textbeschreibung des Fundorts, falls bekannt. */
  location?: string;
  /** Verknüpfung zur interaktiven Karte (map_locations.id). */
  mapLocationId?: string;
  blocks: ContentBlock[];
  publishedAt: string;
}

export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  status: VerificationStatus;
  blocks: ContentBlock[];
  sources?: { label: string; url: string }[];
}

export type MapCategory = "region" | "geheimnis" | "sammelobjekt" | "fahrzeug" | "mission" | "fundort";

export interface MapLocation {
  id: string;
  title: string;
  category: MapCategory;
  description: string;
  status: VerificationStatus;
  /** Koordinaten auf unserer eigenen, schematischen Karte (0–1000). */
  x: number;
  y: number;
  href?: string;
}

/** Suchergebnis über alle Rubriken hinweg. */
export interface SearchResult {
  type: "Seite" | "Mission" | "Geheimnis" | "News" | "Frage" | "Person" | "Symbol";
  title: string;
  excerpt: string;
  href: string;
  status?: VerificationStatus;
}

/** Person/Kontakt im Spiel (z. B. Auftraggeber, Händler, Helfer). */
export interface Contact {
  slug: string;
  name: string;
  category: string;
  /** Wobei die Person helfen kann. */
  helpsWith: string;
  /** Telefonnummer IM SPIEL (fiktiv), falls bekannt. */
  phone?: string;
  /** Wo man die Person trifft bzw. wie man sie freischaltet. */
  location?: string;
  mapLocationId?: string;
  status: VerificationStatus;
  source?: { label: string; url: string };
}

/**
 * Symbol im Spiel (Karte, Radar, Anzeige).
 * Wir zeigen keine Original-Grafiken aus dem Spiel, sondern beschreiben das Symbol
 * und stellen es mit einem eigenen, vereinfachten Zeichen dar.
 */
export interface GameSymbol {
  slug: string;
  name: string;
  category: string;
  /** Eigenes, vereinfachtes Zeichen für die Darstellung auf der Website. */
  icon: IconName;
  /** So sieht das Symbol im Spiel aus (Beschreibung in eigenen Worten). */
  looks: string;
  /** Das bedeutet das Symbol. */
  meaning: string;
  /** Wo es auftaucht, z. B. Karte, Radar oder Anzeige. */
  where?: string;
  status: VerificationStatus;
  source?: { label: string; url: string };
  /** Mehrere unabhängige Quellen (für „verifiziert“ mindestens zwei). */
  sources?: { label: string; url: string }[];
}
