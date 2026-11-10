import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ListingFilters } from "@/components/search/listing-filters";
import { ArticleCard } from "@/components/cards/article-card";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { articleCategories, findCategory } from "@/data/categories";
import { getArticles, type ArticleSort } from "@/lib/content";
import { param, type SearchParams } from "@/lib/utils/params";

export const metadata: Metadata = {
  title: "Tipps & Tricks",
  description: "Ratgeber, Tipps und Tricks zu GTA 6: Anfänger-Tipps, Fahrzeuge, Geld, Gameplay, Einstellungen und mehr – mit klarer Kennzeichnung der Verlässlichkeit.",
  alternates: { canonical: "/tipps" },
};

const sortOptions = [
  { value: "neu", label: "Neueste zuerst" },
  { value: "alt", label: "Älteste zuerst" },
  { value: "titel", label: "Titel A–Z" },
];

const statusOptions = [
  { value: "", label: "Alle Status" },
  { value: "verifiziert", label: "Verifiziert" },
  { value: "unbestaetigt", label: "Unbestätigt" },
  { value: "demo", label: "Demo-Inhalte" },
];

export default async function TippsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = param(sp.q);
  const category = findCategory(articleCategories, param(sp.kategorie) ?? "")?.slug;
  const sort = (["neu", "alt", "titel"].includes(param(sp.sort) ?? "") ? param(sp.sort) : "neu") as ArticleSort;
  const status = statusOptions.some((s) => s.value === param(sp.status)) ? param(sp.status) : undefined;
  const list = getArticles({ q, category, sort, status });
  const activeCategory = category ? findCategory(articleCategories, category) : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Ratgeber"
        title="Tipps & Tricks"
        text="Hilfreiche Ratgeber für jeden Spielstil. Jeder Beitrag zeigt, ob die Information verifiziert, unbestätigt oder ein Demo-Inhalt ist."
        crumbs={[{ label: "Tipps & Tricks" }]}
      />
      <Container className="py-10">
        <ListingFilters
          basePath="/tipps"
          q={q}
          category={category}
          categories={articleCategories}
          placeholder="Ratgeber durchsuchen…"
          selects={[
            { name: "sort", label: "Sortierung", value: sort, options: sortOptions },
            { name: "status", label: "Status", value: status, options: statusOptions },
          ]}
        />

        {activeCategory && (
          <div className="surface mt-8 flex items-center gap-4 p-5">
            <span className="grid size-12 place-items-center rounded-2xl bg-pink/10 text-pink">
              <Icon name={activeCategory.icon} className="size-6" />
            </span>
            <div>
              <h2 className="text-lg font-bold">{activeCategory.name}</h2>
              <p className="text-sm text-muted">{activeCategory.description}</p>
            </div>
          </div>
        )}

        <p className="mt-8 text-sm text-muted" role="status">
          {list.length} {list.length === 1 ? "Ratgeber" : "Ratgeber"} gefunden
        </p>
        {list.length ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState title="Keine Ratgeber gefunden" text="Versuche einen anderen Suchbegriff oder entferne Filter." action={<LinkButton href="/tipps" variant="secondary">Filter zurücksetzen</LinkButton>} />
          </div>
        )}
      </Container>
    </>
  );
}
