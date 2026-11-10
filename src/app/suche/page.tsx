import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { searchContent } from "@/lib/content";
import { listQuestions } from "@/lib/community/queries";
import { param, type SearchParams } from "@/lib/utils/params";
import type { SearchResult } from "@/types/content";

export const metadata: Metadata = {
  title: "Suche",
  description: "Durchsuche Ratgeber, Missionen, Geheimnisse, News und Community-Fragen auf dem 5-Sterne-Kompass.",
  robots: { index: false, follow: true },
};

const typeAccent = { Ratgeber: "pink", Mission: "teal", Geheimnis: "violet", News: "sunset", Frage: "teal" } as const;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const q = param((await searchParams).q)?.trim() ?? "";
  let results: SearchResult[] = [];
  if (q) {
    const { questions } = await listQuestions({ q, limit: 10 });
    results = [
      ...searchContent(q),
      ...questions.map((qu) => ({ type: "Frage" as const, title: qu.title, excerpt: qu.body.slice(0, 180), href: `/fragen/${qu.id}` })),
    ];
  }

  return (
    <>
      <PageHeader title="Suche" text="Finde Ratgeber, Missionen, Geheimnisse, News und Fragen aus der Community." crumbs={[{ label: "Suche" }]}>
        <form action="/suche" role="search" className="relative max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            maxLength={100}
            required
            autoFocus
            aria-label="Suchbegriff"
            placeholder="Suchbegriff eingeben…"
            className="h-14 w-full rounded-2xl border border-line bg-card pl-12 pr-28 text-base outline-none focus:border-teal"
          />
          <button type="submit" className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-xl bg-gradient-to-r from-pink to-violet px-5 text-sm font-semibold">
            Suchen
          </button>
        </form>
      </PageHeader>
      <Container className="max-w-4xl py-10">
        {!q ? (
          <EmptyState title="Wonach suchst du?" text="Gib oben einen Suchbegriff ein, zum Beispiel „Einstellungen“ oder „Fahrzeuge“." />
        ) : results.length === 0 ? (
          <EmptyState
            title={`Keine Treffer für „${q}“`}
            text="Versuche einen anderen Begriff – oder frag einfach die Community."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <LinkButton href="/fragen/neu">Frage stellen</LinkButton>
                <LinkButton href="/community#starter" variant="secondary">
                  Zum Starter-Bereich
                </LinkButton>
              </div>
            }
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted" role="status">
              {results.length} Treffer für „{q}“
            </p>
            <ul className="grid gap-3">
              {results.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="surface group block p-5 transition hover:border-pink/40">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge accent={typeAccent[r.type]}>{r.type}</Badge>
                      {r.status && <StatusBadge status={r.status} />}
                    </div>
                    <p className="font-semibold group-hover:text-pink">{r.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{r.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Container>
    </>
  );
}
