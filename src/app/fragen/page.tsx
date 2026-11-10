import type { Metadata } from "next";
import { MessageSquarePlus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ListingFilters } from "@/components/search/listing-filters";
import { QuestionCard } from "@/components/cards/question-card";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { CommunityDemoNotice } from "@/components/community/demo-notice";
import { communityCategories } from "@/data/categories";
import { listQuestions } from "@/lib/community/queries";
import { param, type SearchParams } from "@/lib/utils/params";

export const metadata: Metadata = {
  title: "Fragen & Antworten",
  description: "Fragen und Antworten der GTA6-Kompass-Community zu Missionen, Fahrzeugen, Geheimnissen, Gameplay und Technik.",
  alternates: { canonical: "/fragen" },
};

const sortOptions = [
  { value: "neu", label: "Neueste" },
  { value: "beliebt", label: "Beliebteste" },
  { value: "unbeantwortet", label: "Unbeantwortet" },
];

export default async function FragenPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = param(sp.q);
  const category = communityCategories.find((c) => c.slug === param(sp.kategorie))?.slug;
  const sort = (sortOptions.some((s) => s.value === param(sp.sort)) ? param(sp.sort) : "neu") as "neu" | "beliebt" | "unbeantwortet";
  const { questions, demo, error } = await listQuestions({ q, category, sort });

  return (
    <>
      <PageHeader eyebrow="Community" title="Fragen & Antworten" text="Durchsuche die Fragen der Community oder stelle deine eigene." crumbs={[{ href: "/community", label: "Community" }, { label: "Fragen" }]}>
        <LinkButton href="/fragen/neu">
          <MessageSquarePlus className="size-4" aria-hidden="true" /> Frage stellen
        </LinkButton>
      </PageHeader>
      <Container className="grid gap-6 py-10">
        {param(sp.geloescht) && <Notice tone="success">Die Frage wurde gelöscht.</Notice>}
        {demo && <CommunityDemoNotice />}
        <ListingFilters basePath="/fragen" q={q} category={category} categories={communityCategories} placeholder="Fragen durchsuchen…" selects={[{ name: "sort", label: "Sortierung", value: sort, options: sortOptions }]} />
        {error ? (
          <Notice tone="error" title="Fehler beim Laden">
            {error} Bitte versuche es später erneut.
          </Notice>
        ) : questions.length ? (
          <>
            <p className="text-sm text-muted" role="status">
              {questions.length} {questions.length === 1 ? "Frage" : "Fragen"}
            </p>
            <div className="grid gap-4">
              {questions.map((qu) => (
                <QuestionCard key={qu.id} question={qu} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState title="Keine Fragen gefunden" text="Ändere die Suche – oder stelle die Frage einfach selbst." action={<LinkButton href="/fragen/neu">Frage stellen</LinkButton>} />
        )}
      </Container>
    </>
  );
}
