/**
 * Gibt strukturierte Daten (JSON-LD) aus.
 * "<" wird maskiert, damit kein Script-Tag aus Inhalten heraus geschlossen werden kann (XSS-Schutz).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
