import type { MetadataRoute } from "next";
import { articles, missions, news, secrets } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/tipps", "/missionen", "/geheimnisse", "/karte", "/news", "/community", "/fragen", "/ueber-uns", "/kontakt", "/community-regeln", "/nutzungsbedingungen", "/melden", "/impressum", "/datenschutz", "/registrieren"];
  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path), changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.7 })),
    ...articles.map((a) => ({ url: absoluteUrl(`/tipps/${a.slug}`), lastModified: a.updatedAt ?? a.publishedAt, priority: 0.6 })),
    ...missions.map((m) => ({ url: absoluteUrl(`/missionen/${m.slug}`), lastModified: m.publishedAt, priority: 0.5 })),
    ...secrets.map((s) => ({ url: absoluteUrl(`/geheimnisse/${s.slug}`), lastModified: s.publishedAt, priority: 0.5 })),
    ...news.map((n) => ({ url: absoluteUrl(`/news/${n.slug}`), lastModified: n.publishedAt, priority: 0.6 })),
  ];
}
