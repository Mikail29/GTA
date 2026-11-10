import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/community/avatar";
import { LikeButton } from "@/components/community/like-button";
import { ReportButton } from "@/components/community/report-button";
import { DeleteButton } from "@/components/community/delete-button";
import { AnswerItem } from "@/components/community/answer-item";
import { AnswerForm } from "@/components/community/answer-form";
import { CommunityDemoNotice } from "@/components/community/demo-notice";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { JsonLd } from "@/components/seo/json-ld";
import { communityCategoryName } from "@/data/categories";
import { getComments, getLikedIds, getQuestion } from "@/lib/community/queries";
import { deleteQuestionAction } from "@/lib/community/actions";
import { getSession, hasRole } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/utils/format";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { question, demo } = await getQuestion((await params).id);
  if (!question) notFound();
  return {
    title: question.title,
    description: question.body.slice(0, 155),
    alternates: { canonical: `/fragen/${question.id}` },
    robots: demo ? { index: false } : undefined,
  };
}

export default async function FragePage({ params }: Props) {
  const { id } = await params;
  const { question, answers, demo } = await getQuestion(id);
  if (!question) notFound();

  const session = demo ? null : await getSession();
  const viewer = { id: session?.userId ?? null, isModerator: hasRole(session, "moderator") };
  const canInteract = Boolean(session) && !demo;
  const isOwner = canInteract && (viewer.id === question.author_id || viewer.isModerator);
  const [liked, comments] = await Promise.all([getLikedIds(session?.userId, [question.id, ...answers.map((a) => a.id)]), getComments(answers.map((a) => a.id))]);
  const deleteThis = deleteQuestionAction.bind(null, question.id);

  return (
    <Container className="max-w-4xl py-10">
      {!demo && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "QAPage",
            mainEntity: {
              "@type": "Question",
              name: question.title,
              text: question.body,
              answerCount: answers.length,
              dateCreated: question.created_at,
              author: { "@type": "Person", name: question.author?.username ?? "Gelöschtes Konto" },
              ...(answers[0]
                ? { suggestedAnswer: answers.slice(0, 5).map((a) => ({ "@type": "Answer", text: a.body, dateCreated: a.created_at, upvoteCount: a.likes_count, author: { "@type": "Person", name: a.author?.username ?? "Gelöschtes Konto" } })) }
                : {}),
            },
          }}
        />
      )}
      <Breadcrumbs items={[{ href: "/community", label: "Community" }, { href: "/fragen", label: "Fragen" }, { label: question.title }]} />
      {demo && (
        <div className="mb-6">
          <CommunityDemoNotice />
        </div>
      )}

      <article className="surface p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <Link href={`/fragen?kategorie=${question.category}`}>
            <Badge accent="teal">{communityCategoryName(question.category)}</Badge>
          </Link>
          {question.is_official && <Badge accent="pink">Offizieller Beitrag vom Team</Badge>}
          {question.status === "beantwortet" && <Badge accent="pink">Beantwortet</Badge>}
          {question.status === "geschlossen" && <Badge>Geschlossen</Badge>}
          {question.is_hidden && <Badge accent="sunset">Ausgeblendet (nur für Moderation sichtbar)</Badge>}
        </div>
        <h1 className="text-2xl font-bold sm:text-4xl">{question.title}</h1>
        <div className="mt-4 flex items-center gap-3 text-sm">
          <Avatar name={question.is_official ? "GTA6-Kompass Team" : (question.author?.username ?? "?")} url={question.is_official ? null : (question.author?.avatar_url ?? null)} size={36} />
          <div>
            <p className="font-semibold">{question.is_official ? "GTA6-Kompass Team" : (question.author?.username ?? "Gelöschtes Konto")}</p>
            <p className="text-xs text-muted">
              <time dateTime={question.created_at}>{formatDateTime(question.created_at)}</time>
              {question.updated_at && " · bearbeitet"}
            </p>
          </div>
        </div>
        <p className="mt-6 whitespace-pre-wrap break-words leading-relaxed text-white/90">{question.body}</p>
        <div className="mt-6 flex flex-wrap items-center gap-1 border-t border-line pt-4">
          <LikeButton targetType="question" targetId={question.id} questionId={question.id} count={question.likes_count} liked={liked.has(question.id)} canInteract={canInteract} />
          {isOwner && (
            <Link href={`/fragen/${question.id}/bearbeiten`} className="inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-xs text-muted hover:text-white">
              <Pencil className="size-3.5" aria-hidden="true" /> Bearbeiten
            </Link>
          )}
          {isOwner && <DeleteButton action={deleteThis} confirmText="Frage inklusive aller Antworten löschen?" />}
          {!demo && <ReportButton targetType="question" targetId={question.id} canInteract={canInteract} />}
        </div>
      </article>

      <section className="mt-10" aria-labelledby="antworten">
        <h2 id="antworten" className="mb-4 text-xl font-bold">
          {answers.length} {answers.length === 1 ? "Antwort" : "Antworten"}
        </h2>
        {answers.length ? (
          <div className="grid gap-4">
            {answers.map((a) => (
              <AnswerItem key={a.id} answer={a} comments={comments.get(a.id) ?? []} liked={liked.has(a.id)} viewer={viewer} demo={demo} />
            ))}
          </div>
        ) : (
          <EmptyState title="Noch keine Antworten" text="Kennst du die Lösung? Hilf mit deiner Antwort weiter." />
        )}
      </section>

      <section className="mt-10" aria-labelledby="antworten-form">
        <h2 id="antworten-form" className="mb-4 text-xl font-bold">
          Deine Antwort
        </h2>
        {demo ? (
          <p className="surface p-5 text-sm text-muted">Antworten sind möglich, sobald die Community-Datenbank verbunden ist. Dann kannst du hier mit deinem Konto mitschreiben.</p>
        ) : !session ? (
          <div className="surface flex flex-col items-start gap-3 p-5">
            <p className="text-sm text-muted">Lesen kannst du alles ohne Konto. Um zu antworten, brauchst du ein kostenloses Konto – das dauert nur eine Minute.</p>
            <div className="flex flex-wrap gap-2">
              <LinkButton href="/registrieren" size="sm">
                Kostenloses Konto erstellen
              </LinkButton>
              <LinkButton href={`/login?next=/fragen/${question.id}`} size="sm" variant="secondary">
                Anmelden
              </LinkButton>
            </div>
          </div>
        ) : question.status === "geschlossen" ? (
          <p className="surface p-5 text-sm text-muted">Diese Frage ist geschlossen.</p>
        ) : (
          <div className="surface p-5">
            <AnswerForm questionId={question.id} />
          </div>
        )}
      </section>
    </Container>
  );
}
