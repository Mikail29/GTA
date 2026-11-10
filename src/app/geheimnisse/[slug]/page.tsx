import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Map, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Badge, SpoilerBadge, StatusBadge } from "@/components/ui/badge";
import { CoverArt } from "@/components/ui/cover-art";
import { ContentBlocks } from "@/components/articles/content-blocks";
import { SpoilerGate } from "@/components/articles/spoiler-gate";
import { ShareButtons } from "@/components/articles/share-buttons";
import { Rating } from "@/components/articles/rating";
import { SecretCard } from "@/components/cards/secret-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { findCategory, secretCategories } from "@/data/categories";
import { getRelatedSecrets, getSecret, secrets } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return secrets.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const secret = getSecret((await params).slug);
  if (!secret) return { title: "Eintrag nicht gefunden" };
  return { title: secret.title, description: secret.excerpt, alternates: { canonical: `/geheimnisse/${secret.slug}` } };
}

export default async function SecretPage({ params }: Props) {
  const secret = getSecret((await params).slug);
  if (!secret) notFound();
  const category = findCategory(secretCategories, secret.category);
  const related = getRelatedSecrets(secret);

  const details = (
    <div className="grid gap-6">
      <ContentBlocks blocks={secret.blocks} />
      <div className="surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden="true" />
          <span>
            <span className="block text-sm font-semibold">Fundort</span>
            <span className="text-sm text-muted">{secret.location ?? "Noch unbekannt"}</span>
          </span>
        </p>
        {secret.mapLocationId && (
          <LinkButton href={`/karte?marker=${secret.mapLocationId}`} variant="secondary" size="sm">
            <Map className="size-4" aria-hidden="true" /> Auf der Karte zeigen
          </LinkButton>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Container className="py-10">
        <Breadcrumbs items={[{ href: "/geheimnisse", label: "Geheimnisse" }, { label: secret.title }]} />
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap gap-2">
              {category && <Badge accent={category.accent}>{category.name}</Badge>}
              <StatusBadge status={secret.status} />
              {secret.spoiler && <SpoilerBadge />}
            </div>
            <h1 className="text-3xl font-bold sm:text-5xl">{secret.title}</h1>
            <p className="mt-4 text-lg text-muted">{secret.excerpt}</p>
            {secret.status !== "verifiziert" && (
              <Notice tone={secret.status === "demo" ? "research" : "warning"} title={secret.status === "demo" ? "Demo-Eintrag" : "Nicht verifiziert"} className="mt-6">
                {secret.status === "demo" ? "Dieser Eintrag ist eine Vorlage. Fundort und Beschreibung sind Platzhalter." : "Dieser Hinweis ist noch nicht durch die Redaktion bestätigt."}
              </Notice>
            )}
            <div className="mt-8">{secret.spoiler ? <SpoilerGate level="leicht">{details}</SpoilerGate> : details}</div>
            <div className="mt-8 grid gap-4">
              <Rating id={`geheimnis:${secret.slug}`} />
              <ShareButtons title={secret.title} path={`/geheimnisse/${secret.slug}`} />
            </div>
          </div>
          <aside>
            <CoverArt accent={category?.accent ?? "violet"} icon={category?.icon ?? "eye"} className="aspect-[4/3] rounded-[1.25rem] border border-line" label="Bildplatzhalter – eigene Aufnahme folgt" />
            <p className="mt-2 text-xs text-muted">Bildplatzhalter – es werden nur eigene oder lizenzierte Bilder verwendet.</p>
          </aside>
        </div>
      </Container>
      {related.length > 0 && (
        <Container className="pb-6">
          <SectionHeading title="Weitere Geheimnisse" href="/geheimnisse" linkLabel="Alle Einträge" />
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((s) => (
              <SecretCard key={s.slug} secret={s} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
