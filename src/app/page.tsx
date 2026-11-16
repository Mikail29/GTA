import Link from "next/link";
import { Clock, Globe, MessageSquarePlus } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { QuickAccess } from "@/components/home/quick-access";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { QuestionCard } from "@/components/cards/question-card";
import { LinkButton } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getLatestEntries, getNews } from "@/lib/content";
import { listQuestions } from "@/lib/community/queries";
import { formatDate } from "@/lib/utils/format";

export default async function HomePage() {
  const latest = getLatestEntries(2);
  const latestNews = getNews().slice(0, 2);
  const { questions, demo } = await listQuestions({ limit: 4, pinnedFirst: true });

  return (
    <>
      <Hero />

      <Container className="relative -mt-10 pb-4 sm:-mt-16">
        <section aria-labelledby="schnellzugriff">
          <h2 id="schnellzugriff" className="sr-only">
            Schnellzugriff
          </h2>
          <QuickAccess />
          <Link
            href="/online"
            className="surface group mt-3 flex flex-col gap-3 border-sunset/30 p-4 transition hover:border-sunset/60 sm:flex-row sm:items-center"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sunset/12 text-sunset">
              <Globe className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">GTA 6 Online</span>
              <span className="block text-sm text-muted">Der Bereich für den Online-Modus entsteht, sobald GTA 6 Online erscheint.</span>
            </span>
            <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-sunset/40 bg-sunset/10 px-3 py-1.5 text-xs font-semibold text-sunset sm:self-center">
              <Clock className="size-3.5" aria-hidden="true" /> Momentan noch nicht verfügbar
            </span>
          </Link>
        </section>

        <section className="mt-16" aria-label="Community-Vorschau">
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

        <section className="mt-16 grid gap-8 lg:grid-cols-2" aria-label="Neueste Beiträge und News">
          <div>
            <SectionHeading compact eyebrow="Neu" title="Neueste Beiträge" />
            <ul className="grid gap-2">
              {latest.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="surface group flex items-center gap-3 px-4 py-3 transition hover:border-pink/40">
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm font-semibold group-hover:text-pink">{e.title}</span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {e.type} · <time dateTime={e.publishedAt}>{formatDate(e.publishedAt)}</time>
                      </span>
                    </span>
                    <StatusBadge status={e.status} className="hidden shrink-0 sm:inline-flex" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading compact eyebrow="News" title="Neuigkeiten" href="/news" linkLabel="Alle News" />
            <ul className="grid gap-2">
              {latestNews.map((n) => (
                <li key={n.slug}>
                  <Link href={`/news/${n.slug}`} className="surface group block px-4 py-3 transition hover:border-teal/40">
                    <span className="line-clamp-2 text-sm font-semibold group-hover:text-teal">{n.title}</span>
                    <time dateTime={n.publishedAt} className="mt-0.5 block text-xs text-teal">
                      {formatDate(n.publishedAt)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Container>
    </>
  );
}
