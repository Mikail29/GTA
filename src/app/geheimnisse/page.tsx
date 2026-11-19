import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ListingFilters } from "@/components/search/listing-filters";
import { SecretCard } from "@/components/cards/secret-card";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { findCategory, secretCategories } from "@/data/categories";
import { getSecrets, secrets } from "@/lib/content";
import { ReleasePending } from "@/components/world/release-pending";
import { param, type SearchParams } from "@/lib/utils/params";

export const metadata: Metadata = {
  title: "Geheimnisse & Fundorte",
  description: "Easter Eggs, versteckte Orte, Sammelobjekte und seltene Fahrzeuge in GTA 6 – jeder Eintrag mit Verifizierungsstatus und Spoiler-Kennzeichnung.",
  alternates: { canonical: "/geheimnisse" },
};

const statusOptions = [
  { value: "", label: "Alle Status" },
  { value: "verifiziert", label: "Verifiziert" },
  { value: "unbestaetigt", label: "Unbestätigt" },
  { value: "demo", label: "Demo-Inhalte" },
];

export default async function GeheimnissePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = param(sp.q);
  const category = findCategory(secretCategories, param(sp.kategorie) ?? "")?.slug;
  const status = statusOptions.some((s) => s.value && s.value === param(sp.status)) ? param(sp.status) : undefined;
  const list = getSecrets({ q, category, status });

  return (
    <>
      <PageHeader
        eyebrow="Entdecken"
        title="Geheimnisse & Fundorte"
        text="Easter Eggs, versteckte Orte, besondere Gegenstände, Sammelobjekte und seltene Fahrzeuge."
        crumbs={[{ label: "Geheimnisse" }]}
      />
      <Container className="py-10">
        {secrets.length === 0 ? (
          <ReleasePending what="Geheimnisse, Easter Eggs und Fundorte" />
        ) : (
          <>
            <Notice tone="research" title="Keine erfundenen Fundorte" className="mb-8">
              Wir veröffentlichen nur geprüfte Fundorte – erkennbar am Status „Verifiziert“. Hinweise aus der Community sind als „Unbestätigt“ gekennzeichnet.
            </Notice>
            <ListingFilters
              basePath="/geheimnisse"
              q={q}
              category={category}
              categories={secretCategories}
              placeholder="Geheimnisse durchsuchen…"
              selects={[{ name: "status", label: "Status", value: status, options: statusOptions }]}
            />
            <p className="mt-8 text-sm text-muted" role="status">
              {list.length} {list.length === 1 ? "Eintrag" : "Einträge"} gefunden
            </p>
            {list.length ? (
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <h2 className="sr-only">Gefundene Einträge</h2>
                {list.map((s) => (
                  <SecretCard key={s.slug} secret={s} />
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState
                  title="Keine Einträge gefunden"
                  text="Passe Suche oder Filter an."
                  action={
                    <LinkButton href="/geheimnisse" variant="secondary">
                      Filter zurücksetzen
                    </LinkButton>
                  }
                />
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
