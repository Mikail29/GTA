import "server-only";

/**
 * Einfaches In-Memory-Rate-Limit (Sliding Window) pro Schlüssel (z. B. IP).
 *
 * Hinweis: Bei Serverless-Deployments mit mehreren Instanzen gilt das Limit
 * pro Instanz. Für hohe Last sollte ein zentraler Speicher (z. B. Redis/Upstash
 * oder eine Supabase-Tabelle) verwendet werden – siehe README.
 */
const buckets = new Map<string, number[]>();

/** Längstes verwendetes Zeitfenster. Einträge (sie enthalten z. B. die IP-Adresse) werden danach gelöscht. */
const MAX_AGE_MS = 60 * 60_000;
let lastSweep = 0;

function sweep(now: number) {
  for (const [k, v] of buckets) if (v.every((t) => now - t >= MAX_AGE_MS)) buckets.delete(k);
  lastSweep = now;
}

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

  // Alte Einträge spätestens jede Minute aufräumen (Datenschutz: IP-Adressen nur kurzzeitig im Speicher)
  if (now - lastSweep > 60_000 || buckets.size > 5000) sweep(now);
  return { ok: true as const, remaining: limit - hits.length };
}

export function clientKey(headers: Headers) {
  // Netlify liefert die echte Besucher-IP in x-nf-client-connection-ip.
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return headers.get("x-nf-client-connection-ip") || forwarded || headers.get("x-real-ip") || "unbekannt";
}
