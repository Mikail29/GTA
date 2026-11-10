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
  | "eye";

/** Farbschema für Platzhalter-Vorschaubilder. */
export type Accent = "pink" | "teal" | "violet" | "sunset";

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: IconName;
  accent: Accent;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  status: VerificationStatus;
  popular?: boolean;
  tags: string[];
  blocks: ContentBlock[];
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

export type MapCategory = "geheimnis" | "sammelobjekt" | "fahrzeug" | "mission" | "fundort";

export interface MapLocation {
  id: string;
  title: string;
  category: MapCategory;
  description: string;
  status: VerificationStatus;
  /** Koordinaten im eigenen Platzhalter-Kartensystem (0–1000). */
  x: number;
  y: number;
  href?: string;
}

/** Suchergebnis über alle Rubriken hinweg. */
export interface SearchResult {
  type: "Ratgeber" | "Mission" | "Geheimnis" | "News" | "Frage" | "Person" | "Laden";
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

/** Laden im Spiel (z. B. Waffen, Kleidung). */
export interface Shop {
  slug: string;
  name: string;
  category: string;
  description: string;
  location?: string;
  mapLocationId?: string;
  status: VerificationStatus;
  source?: { label: string; url: string };
}
