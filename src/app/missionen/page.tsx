import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ListingFilters } from "@/components/search/listing-filters";
import { MissionCard } from "@/components/cards/mission-card";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { findCategory, missionCategories } from "@/data/categories";
import { getMissions } from "@/lib/content";
import { param, type SearchParams } from "@/lib/utils/params";

export const metadata: Metadata = {
  title: "Missionen & Komplettlösungen",
  description: "Komplettlösungen zu GTA-6-Missionen: Schritt-für-Schritt-Anleitungen mit Spoiler-Warnungen, Tipps und verwandten Missionen.",
  alternates: { canonical: "/missionen" },
};

const difficultyOptions = [
  { value: "", label: "Alle Schwierigkeiten" },
  { value: "leicht", label: "Leicht" },
  { value: "mittel", label: "Mittel" },
  { value: "schwer", label: "Schwer" },
];

export default async function MissionenPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = param(sp.q);
  const category = findCategory(missionCategories, param(sp.kategorie) ?? "")?.slug;
  const difficulty = difficultyOptions.some((d) => d.value && d.value === param(sp.schwierigkeit)) ? param(sp.schwierigkeit) : undefined;
  const list = getMissions({ q, category, difficulty });

  return (
    <>
      <PageHeader eyebrow="Komplettlösungen" title="Missionen" text="Schritt-für-Schritt-Hilfen für Story, Nebenaufträge und Herausforderungen – mit klaren Spoiler-Warnungen." crumbs={[{ label: "Missionen" }]} />
      <Container className="py-10">
        <Notice tone="research" title="Die ersten Missionen sind da" className="mb-8">
          Die Geschichte ist laut Rockstar – wie bei Red Dead Redemption 2 – in Kapitel aufgeteilt. Wir tragen die Missionen Schritt für Schritt ein: nur mit geprüften Fakten aus mehreren
          Quellen oder aus eigenem Spielen, in eigenen Worten. Du hast eine Mission schon gespielt? Teile deine Tipps in der Community.
        </Notice>
        <ListingFilters
          basePath="/missionen"
          q={q}
          category={category}
          categories={missionCategories}
          placeholder="Missionen durchsuchen…"
          selects={[{ name: "schwierigkeit", label: "Schwierigkeit", value: difficulty, options: difficultyOptions }]}
        />
        <p className="mt-8 text-sm text-muted" role="status">
          {list.length} {list.length === 1 ? "Mission" : "Missionen"} gefunden
        </p>
        {list.length ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((m) => (
              <MissionCard key={m.slug} mission={m} />
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState title="Keine Missionen gefunden" text="Passe Suche oder Filter an." action={<LinkButton href="/missionen" variant="secondary">Filter zurücksetzen</LinkButton>} />
          </div>
        )}
      </Container>
    </>
  );
}
