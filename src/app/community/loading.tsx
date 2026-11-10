import { Container } from "@/components/ui/container";

/** Ladezustand mit Skeleton-Karten. */
export default function Loading() {
  return (
    <Container className="py-14" aria-busy="true">
      <span className="sr-only" role="status">
        Inhalte werden geladen…
      </span>
      <div className="h-10 w-2/3 max-w-md animate-pulse rounded-xl bg-card" />
      <div className="mt-4 h-5 w-1/2 max-w-sm animate-pulse rounded-lg bg-card" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="surface h-64 animate-pulse" />
        ))}
      </div>
    </Container>
  );
}
