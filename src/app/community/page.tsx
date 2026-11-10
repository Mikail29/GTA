import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, MessageSquarePlus, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { QuestionCard } from "@/components/cards/question-card";
import { EmptyState } from "@/components/ui/empty-state";
import { CommunityDemoNotice } from "@/components/community/demo-notice";
import { communityCategories } from "@/data/categories";
import { listQuestions } from "@/lib/community/queries";

export const metadata: Metadata = {
  title: "Community",
  description: "Die GTA6-Kompass-Community: Fragen stellen, Antworten geben, diskutieren und gemeinsam Geheimnisse lüften.",
  alternates: { canonical: "/community" },
};

export default async function CommunityPage() {
  const [{ questions: latest, demo }, { questions: popular }] = await Promise.all([listQuestions({ limit: 6 }), listQuestions({ limit: 4, sort: "beliebt" })]);

  return (
    <>
      <PageHeader eyebrow="Gemeinsam" title="Community" text="Stelle Fragen, teile dein Wissen und hilf anderen Spielern – fair, freundlich und spoilerbewusst." crumbs={[{ label: "Community" }]}>
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/fragen/neu">
            <MessageSquarePlus className="size-4" aria-hidden="true" /> Frage stellen
          </LinkButton>
          <LinkButton href="/fragen" variant="secondary">
            Alle Fragen
          </LinkButton>
        </div>
      </PageHeader>
      <Container className="py-10">
        {demo && <CommunityDemoNotice />}

        <section className="mt-8" aria-label="Kategorien">
          <SectionHeading title="Kategorien" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communityCategories.map((c) => (
              <li key={c.slug}>
                <Link href={`/fragen?kategorie=${c.slug}`} className="surface group block h-full p-5 transition hover:-translate-y-0.5 hover:border-teal/40">
                  <p className="font-semibold group-hover:text-teal">{c.name}</p>
                  <p className="mt-1 text-sm text-muted">{c.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <section aria-label="Neueste Fragen">
            <SectionHeading title="Neueste Fragen" href="/fragen" />
            {latest.length ? (
              <div className="grid gap-4">
                {latest.map((q) => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </div>
            ) : (
              <EmptyState title="Noch keine Fragen" text="Stelle die erste Frage!" action={<LinkButton href="/fragen/neu">Frage stellen</LinkButton>} />
            )}
          </section>
          <aside className="grid content-start gap-6">
            <section className="surface p-5" aria-labelledby="beliebt">
              <h2 id="beliebt" className="mb-3 font-bold">
                Beliebte Diskussionen
              </h2>
              <ol className="grid gap-3">
                {popular.map((q, i) => (
                  <li key={q.id} className="flex gap-3">
                    <span className="text-gradient font-display text-xl font-bold">{i + 1}</span>
                    <Link href={`/fragen/${q.id}`} className="text-sm hover:text-pink">
                      {q.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
            {[
              { Icon: ShieldCheck, title: "Fair & sicher", text: "Beiträge werden moderiert. Melde Inhalte, die gegen die Regeln verstoßen.", href: "/community-regeln", link: "Community-Regeln" },
              { Icon: BookOpen, title: "Erst nachlesen?", text: "Viele Antworten findest du bereits in unseren Ratgebern.", href: "/tipps", link: "Zu den Ratgebern" },
              { Icon: Users, title: "Mitmachen", text: "Mit einem kostenlosen Konto kannst du Fragen stellen, antworten und liken.", href: "/registrieren", link: "Konto erstellen" },
            ].map(({ Icon, title, text, href, link }) => (
              <div key={title} className="surface p-5">
                <Icon className="mb-2 size-5 text-teal" aria-hidden="true" />
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted">{text}</p>
                <Link href={href} className="mt-2 inline-block text-sm font-semibold text-teal hover:text-white">
                  {link} →
                </Link>
              </div>
            ))}
          </aside>
        </div>
      </Container>
    </>
  );
}
