import type { ContentBlock } from "@/types/content";

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

/** Berechnet die Lesedauer in Minuten (ca. 200 Wörter pro Minute). */
export function readingMinutes(blocks: ContentBlock[]) {
  const words = blocks
    .flatMap((b) => {
      if (b.type === "ul" || b.type === "ol") return b.items;
      if (b.type === "note") return [b.title ?? "", b.text];
      return [b.text];
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Normalisiert Text für eine einfache, tolerante Suche. */
export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss");
}

export function matchesQuery(query: string, ...fields: Array<string | undefined>) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalize(fields.filter(Boolean).join(" "));
  return terms.every((t) => haystack.includes(t));
}

export function blocksToText(blocks: ContentBlock[]) {
  return blocks
    .map((b) => (b.type === "ul" || b.type === "ol" ? b.items.join(" ") : b.type === "note" ? b.text : b.text))
    .join(" ");
}
