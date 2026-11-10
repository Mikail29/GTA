import Link from "next/link";
import { ArrowRight, CalendarDays, MessageSquarePlus, Rocket } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { QuickAccess } from "@/components/home/quick-access";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArticleCard } from "@/components/cards/article-card";
import { QuestionCard } from "@/components/cards/question-card";
import { LinkButton } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getLatestArticles, getNews, getPopularArticles } from "@/lib/content";
import { listQuestions } from "@/lib/community/queries";
import { formatDate } from "@/lib/utils/format";

export default async function HomePage() {
  const popular = getPopularArticles(3);
  const latest = getLatestArticles(4);
  const latestNews = getNews().slice(0, 3);
  const { questions, demo } = await listQuestions({ limit: 4 });

  return (
    <>
      <Hero />

      <Container className="relative -mt-10 sm:-mt-16">
        <section aria-labelledby="schnellzugriff">
          <h2 id="schnellzugriff" className="sr-only">
            Schnellzugriff
          </h2>
          <QuickAccess />
        </section>

        <section className="mt-24" aria-label="Beliebte Ratgeber">
          <SectionHeading eyebrow="Beliebt" title="Beliebte Ratgeber" text="Die meistgelesenen Guides der Community." href="/tipps" linkLabel="Alle Ratgeber" />
          <div className="grid gap-6 md:grid-cols-3">
            {popular.map((a, i) => (
              <ArticleCard key={a.slug} article={a} priority={i === 0} />
            ))}
          </div>
        </section>

        <section className="mt-24 grid gap-10 lg:grid-cols-[1.5fr_1fr]" aria-label="Neueste Beiträge und News">
          <div>
            <SectionHeading eyebrow="Neu" title="Neueste Beiträge" href="/tipps?sort=neu" linkLabel="Mehr Beiträge" />
            <ul className="grid gap-3">
              {latest.map((a) => (
                <li key={a.slug}>
                  <Link href={`/tipps/${a.slug}`} className="surface group flex items-center gap-4 p-4 transition hover:border-pink/40">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2 text-xs text-muted">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="font-semibold group-hover:text-pink">{a.title}</p>
                    </div>
                    <ArrowRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-pink" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="News" title="Neuigkeiten" href="/news" linkLabel="Alle News" />
            <ul className="surface divide-y divide-line/70">
              {latestNews.map((n) => (
                <li key={n.slug}>
                  <Link href={`/news/${n.slug}`} className="group block p-4">
                    <time dateTime={n.publishedAt} className="text-xs text-teal">
                      {formatDate(n.publishedAt)}
                    </time>
                    <p className="mt-1 font-semibold group-hover:text-teal">{n.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{n.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-24" aria-label="Community-Vorschau">
          <SectionHeading
            eyebrow="Community"
            title="Aktuelle Fragen & Diskussionen"
            text={demo ? "Beispielansicht – sobald die Datenbank verbunden ist, erscheinen hier echte Beiträge." : "Was die Community gerade beschäftigt."}
            href="/fragen"
            linkLabel="Alle Fragen"
          />
          {questions.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {questions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          ) : (
            <EmptyState title="Noch keine Fragen" text="Sei die erste Person, die eine Frage stellt!" action={<LinkButton href="/fragen/neu">Frage stellen</LinkButton>} />
          )}
          <div className="mt-6 flex justify-center">
            <LinkButton href="/fragen/neu" variant="secondary">
              <MessageSquarePlus className="size-4" aria-hidden="true" /> Eigene Frage stellen
            </LinkButton>
          </div>
        </section>

        <section className="relative mt-24 overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-[#2a1450] via-card to-[#0f2a3a] p-8 sm:p-12" aria-labelledby="starter-teaser">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-teal/20 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
                <Rocket className="size-4" aria-hidden="true" /> GTA 6 Starter
              </p>
              <h2 id="starter-teaser" className="text-2xl font-bold sm:text-3xl">
                Starte gemeinsam mit der Community in GTA 6.
              </h2>
              <p className="mt-3 text-muted">Stell dich vor, stell Einsteigerfragen und hilf anderen. Kostenlos, ohne Werbung und ohne Tracking.</p>
            </div>
            <LinkButton href="/community#starter" size="lg">
              Jetzt einsteigen <ArrowRight className="size-5" aria-hidden="true" />
            </LinkButton>
          </div>
        </section>
      </Container>
    </>
  );
}
