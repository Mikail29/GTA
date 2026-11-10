import { articles } from "@/data/articles";
import { missions } from "@/data/missions";
import { secrets } from "@/data/secrets";
import { news } from "@/data/news";
import { contacts } from "@/data/contacts";
import { shops } from "@/data/shops";
import { blocksToText, matchesQuery } from "@/lib/utils/format";
import type { Article, Mission, SearchResult, Secret } from "@/types/content";

/**
 * Datenzugriff auf redaktionelle Inhalte.
 * Aktuell aus statischen Dateien (src/data). Die Funktionen sind so gestaltet,
 * dass sie später gegen Supabase-Abfragen ausgetauscht werden können,
 * ohne dass sich Seiten oder Komponenten ändern müssen.
 */

const byDateDesc = <T extends { publishedAt: string }>(a: T, b: T) => b.publishedAt.localeCompare(a.publishedAt);

export type ArticleSort = "neu" | "alt" | "titel";

export function getArticles(opts: { q?: string; category?: string; sort?: ArticleSort; status?: string } = {}) {
  let list = articles.filter(
    (a) =>
      (!opts.category || a.category === opts.category) &&
      (!opts.status || a.status === opts.status) &&
      (!opts.q || matchesQuery(opts.q, a.title, a.excerpt, a.tags.join(" "), blocksToText(a.blocks))),
  );
  list = [...list];
  if (opts.sort === "alt") list.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  else if (opts.sort === "titel") list.sort((a, b) => a.title.localeCompare(b.title, "de"));
  else list.sort(byDateDesc);
  return list;
}

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const getPopularArticles = (limit = 3) => articles.filter((a) => a.popular).sort(byDateDesc).slice(0, limit);
export const getLatestArticles = (limit = 3) => [...articles].sort(byDateDesc).slice(0, limit);

export function getRelatedArticles(article: Article, limit = 3) {
  const sameCategory = articles.filter((a) => a.slug !== article.slug && a.category === article.category);
  const others = articles.filter((a) => a.slug !== article.slug && a.category !== article.category);
  return [...sameCategory, ...others.sort(byDateDesc)].slice(0, limit);
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
  for (const a of getArticles({ q })) results.push({ type: "Ratgeber", title: a.title, excerpt: a.excerpt, href: `/tipps/${a.slug}`, status: a.status });
  for (const m of getMissions({ q })) results.push({ type: "Mission", title: m.title, excerpt: m.excerpt, href: `/missionen/${m.slug}`, status: m.status });
  for (const s of getSecrets({ q })) results.push({ type: "Geheimnis", title: s.title, excerpt: s.excerpt, href: `/geheimnisse/${s.slug}`, status: s.status });
  for (const n of news.filter((n) => matchesQuery(q, n.title, n.excerpt, blocksToText(n.blocks))))
    results.push({ type: "News", title: n.title, excerpt: n.excerpt, href: `/news/${n.slug}`, status: n.status });
  for (const c of contacts.filter((c) => matchesQuery(q, c.name, c.helpsWith, c.location, c.phone)))
    results.push({ type: "Person", title: c.name, excerpt: c.helpsWith, href: `/personen#${c.category}`, status: c.status });
  for (const s of shops.filter((s) => matchesQuery(q, s.name, s.description, s.location)))
    results.push({ type: "Laden", title: s.name, excerpt: s.description, href: `/laeden#${s.category}`, status: s.status });
  return results;
}

export { articles, missions, secrets, news };
