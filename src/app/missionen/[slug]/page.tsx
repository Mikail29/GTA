import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Gauge, Lightbulb, Timer } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Badge, SpoilerBadge, StatusBadge } from "@/components/ui/badge";
import { Notice } from "@/components/ui/notice";
import { SpoilerGate } from "@/components/articles/spoiler-gate";
import { ShareButtons } from "@/components/articles/share-buttons";
import { Rating } from "@/components/articles/rating";
import { MissionCard } from "@/components/cards/mission-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { findCategory, missionCategories } from "@/data/categories";
import { getMission, getRelatedMissions, missions } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return missions.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mission = getMission((await params).slug);
  if (!mission) return { title: "Mission nicht gefunden" };
  return { title: mission.title, description: mission.excerpt, alternates: { canonical: `/missionen/${mission.slug}` } };
}

const difficultyLabel = { leicht: "Leicht", mittel: "Mittel", schwer: "Schwer" } as const;

export default async function MissionPage({ params }: Props) {
  const mission = getMission((await params).slug);
  if (!mission) notFound();
  const category = findCategory(missionCategories, mission.category);
  const related = getRelatedMissions(mission);

  const walkthrough = (
    <div className="grid gap-8">
      <section aria-labelledby="voraussetzungen" className="surface p-6">
        <h2 id="voraussetzungen" className="mb-3 text-xl font-bold">
          Voraussetzungen
        </h2>
        <ul className="grid gap-2 text-muted">
          {mission.requirements.map((r) => (
            <li key={r} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden="true" /> {r}
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="schritte">
        <h2 id="schritte" className="mb-4 text-2xl font-bold">
          Schritt für Schritt
        </h2>
        <ol className="relative grid gap-4 border-l border-line pl-6">
          {mission.steps.map((s, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[2.35rem] grid size-8 place-items-center rounded-full bg-gradient-to-br from-pink to-violet text-sm font-bold">{i + 1}</span>
              <div className="surface p-5">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="tipps" className="surface border-teal/30 p-6">
        <h2 id="tipps" className="mb-3 flex items-center gap-2 text-xl font-bold">
          <Lightbulb className="size-5 text-teal" aria-hidden="true" /> Tipps
        </h2>
        <ul className="grid gap-2 text-muted">
          {mission.tips.map((t) => (
            <li key={t}>• {t}</li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <>
      <Container className="py-10">
        <Breadcrumbs items={[{ href: "/missionen", label: "Missionen" }, { label: mission.title }]} />
        <div className="mb-4 flex flex-wrap gap-2">
          {category && <Badge accent={category.accent}>{category.name}</Badge>}
          <StatusBadge status={mission.status} />
          {mission.spoiler !== "keine" && <SpoilerBadge />}
        </div>
        <h1 className="max-w-4xl text-3xl font-bold sm:text-5xl">{mission.title}</h1>
        <p className="mt-4 max-w-3xl text-lg text-muted">{mission.excerpt}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>
            <Gauge className="size-3.5" aria-hidden="true" /> Schwierigkeit: {difficultyLabel[mission.difficulty]}
          </Badge>
          {mission.estimatedMinutes && (
            <Badge>
              <Timer className="size-3.5" aria-hidden="true" /> ca. {mission.estimatedMinutes} Minuten
            </Badge>
          )}
        </div>

        <Notice tone={mission.spoiler === "keine" ? "info" : "warning"} title="Spoiler-Hinweis" className="mt-8">
          {mission.spoiler === "keine"
            ? "Diese Seite enthält keine Story-Spoiler."
            : mission.spoiler === "leicht"
              ? "Diese Seite enthält leichte Spoiler zum Missionsablauf."
              : "Diese Seite enthält starke Spoiler zur Handlung. Lies nur weiter, wenn du nicht überrascht werden möchtest."}{" "}
          {mission.status === "demo" && "Hinweis: Dies ist eine Demo-Vorlage ohne echte Spielinhalte."}
        </Notice>

        <div className="mt-8 max-w-3xl">
          {mission.spoiler === "keine" ? walkthrough : <SpoilerGate level={mission.spoiler}>{walkthrough}</SpoilerGate>}
          <div className="mt-8 grid gap-4">
            <Rating id={`mission:${mission.slug}`} />
            <ShareButtons title={mission.title} path={`/missionen/${mission.slug}`} />
          </div>
        </div>
      </Container>
      {related.length > 0 && (
        <Container className="pb-6">
          <SectionHeading title="Verwandte Missionen" href="/missionen" linkLabel="Alle Missionen" />
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((m) => (
              <MissionCard key={m.slug} mission={m} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
