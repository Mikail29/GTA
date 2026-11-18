import { missions } from "@/data/missions";
import { secrets } from "@/data/secrets";
import { news } from "@/data/news";
import { contacts } from "@/data/contacts";
import { symbols } from "@/data/symbols";
import { blocksToText, matchesQuery } from "@/lib/utils/format";
import type { Mission, SearchResult, Secret, VerificationStatus } from "@/types/content";

/**
 * Datenzugriff auf redaktionelle Inhalte.
 * Aktuell aus statischen Dateien (src/data). Die Funktionen sind so gestaltet,
 * dass sie später gegen Supabase-Abfragen ausgetauscht werden können,
 * ohne dass sich Seiten oder Komponenten ändern müssen.
 */

const byDateDesc = <T extends { publishedAt: string }>(a: T, b: T) => b.publishedAt.localeCompare(a.publishedAt);

/** Neueste Beiträge aus Missionen und Geheimnissen (für die Startseite). */
export interface LatestEntry {
  type: "Mission" | "Geheimnis";
  title: string;
  href: string;
  publishedAt: string;
  status: VerificationStatus;
}

export function getLatestEntries(limit = 3): LatestEntry[] {
  return [
    ...missions.map((m) => ({ type: "Mission" as const, title: m.title, href: `/missionen/${m.slug}`, publishedAt: m.publishedAt, status: m.status })),
    ...secrets.map((s) => ({ type: "Geheimnis" as const, title: s.title, href: `/geheimnisse/${s.slug}`, publishedAt: s.publishedAt, status: s.status })),
  ]
    .sort(byDateDesc)
    .slice(0, limit);
}

export function getMissions(opts: { q?: string; category?: string; difficulty?: string } = {}) {
  return missions
    .filter(
      (m) =>
        (!opts.category || m.category === opts.category) &&
        (!opts.difficulty || m.difficulty === opts.difficulty) &&
        (!opts.q || matchesQuery(opts.q, m.title, m.excerpt, m.steps.map((s) => `${s.title} ${s.text}`).join(" "))),
    )
    .sort(byDateDesc);
}

export const getMission = (slug: string) => missions.find((m) => m.slug === slug);
export const getRelatedMissions = (mission: Mission) =>
  mission.related.map((slug) => missions.find((m) => m.slug === slug)).filter((m): m is Mission => Boolean(m));

export function getSecrets(opts: { q?: string; category?: string; status?: string } = {}) {
  return secrets
    .filter(
      (s) =>
        (!opts.category || s.category === opts.category) &&
        (!opts.status || s.status === opts.status) &&
        (!opts.q || matchesQuery(opts.q, s.title, s.excerpt, s.location, blocksToText(s.blocks))),
    )
    .sort(byDateDesc);
}

export const getSecret = (slug: string) => secrets.find((s) => s.slug === slug);
export const getRelatedSecrets = (secret: Secret, limit = 3) =>
  secrets.filter((s) => s.slug !== secret.slug && s.category === secret.category).concat(secrets.filter((s) => s.slug !== secret.slug && s.category !== secret.category)).slice(0, limit);

export const getNews = () => [...news].sort(byDateDesc);
export const getNewsItem = (slug: string) => news.find((n) => n.slug === slug);

/** Durchsucht alle redaktionellen Inhalte. */
export function searchContent(q: string): SearchResult[] {
  if (!q.trim()) return [];
  const results: SearchResult[] = [];
  for (const m of getMissions({ q })) results.push({ type: "Mission", title: m.title, excerpt: m.excerpt, href: `/missionen/${m.slug}`, status: m.status });
  for (const s of getSecrets({ q })) results.push({ type: "Geheimnis", title: s.title, excerpt: s.excerpt, href: `/geheimnisse/${s.slug}`, status: s.status });
  for (const n of news.filter((n) => matchesQuery(q, n.title, n.excerpt, blocksToText(n.blocks))))
    results.push({ type: "News", title: n.title, excerpt: n.excerpt, href: `/news/${n.slug}`, status: n.status });
  for (const c of contacts.filter((c) => matchesQuery(q, c.name, c.helpsWith, c.location, c.phone)))
    results.push({ type: "Person", title: c.name, excerpt: c.helpsWith, href: `/personen#${c.category}`, status: c.status });
  for (const s of symbols.filter((s) => matchesQuery(q, s.name, s.meaning, s.looks, s.where)))
    results.push({ type: "Symbol", title: s.name, excerpt: s.meaning, href: `/symbole#${s.category}`, status: s.status });
  return results;
}

export { missions, secrets, news };
