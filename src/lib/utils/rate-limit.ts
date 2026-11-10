import "server-only";

/**
 * Einfaches In-Memory-Rate-Limit (Sliding Window) pro Schlüssel (z. B. IP).
 *
 * Hinweis: Bei Serverless-Deployments mit mehreren Instanzen gilt das Limit
 * pro Instanz. Für hohe Last sollte ein zentraler Speicher (z. B. Redis/Upstash
 * oder eine Supabase-Tabelle) verwendet werden – siehe README.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    const retryAfter = Math.ceil((windowMs - (now - hits[0])) / 1000);
    return { ok: false as const, retryAfter };
  }
  hits.push(now);
  buckets.set(key, hits);

  // Speicher gelegentlich aufräumen
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return { ok: true as const, remaining: limit - hits.length };
}

export function clientKey(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unbekannt";
}
