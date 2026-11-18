import type { ContentBlock } from "@/types/content";
import { synonymGroups } from "@/lib/content/synonyms";

const dateFormatter = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Berlin" });
const dateTimeFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Berlin",
});

export function formatDate(value: string | Date) {
  return dateFormatter.format(typeof value === "string" ? new Date(value) : value);
}

export function formatDateTime(value: string | Date) {
  return dateTimeFormatter.format(typeof value === "string" ? new Date(value) : value);
}


/** Normalisiert Text für eine einfache, tolerante Suche. */
export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss");
}

const normalizedGroups = synonymGroups.map((g) => g.map((w) => normalize(w)));

/** Alle Schreibweisen, die für einen Suchbegriff als Treffer zählen (der Begriff selbst plus Synonyme). */
export function expandTerm(term: string) {
  const out = new Set([term]);
  for (const group of normalizedGroups) {
    // Treffer, wenn der Begriff ein Wort der Gruppe ist oder damit beginnt (z. B. „missionen“ → „mission“).
    if (group.some((w) => term === w || (w.length >= 4 && term.startsWith(w)) || (term.length >= 4 && w.startsWith(term)))) group.forEach((w) => out.add(w));
  }
  return [...out];
}

/** Prüft, ob alle Suchbegriffe (oder ein Synonym davon) im Text vorkommen. */
export function matchesQuery(query: string, ...fields: Array<string | undefined>) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalize(fields.filter(Boolean).join(" "));
  // Der Begriff selbst darf irgendwo im Wort stehen, Synonyme nur am Wortanfang (sonst passt „ort“ auch in „Wort“).
  const atWordStart = (alt: string) => haystack.startsWith(alt) || new RegExp(`[^a-z0-9]${alt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(haystack);
  return terms.every((t) => haystack.includes(t) || expandTerm(t).some((alt) => alt !== t && atWordStart(alt)));
}

export function blocksToText(blocks: ContentBlock[]) {
  return blocks
    .map((b) => (b.type === "ul" || b.type === "ol" ? b.items.join(" ") : b.type === "note" ? b.text : b.text))
    .join(" ");
}
