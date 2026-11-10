import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { QuestionForm } from "@/components/community/question-form";
import { getQuestion } from "@/lib/community/queries";
import { hasRole, requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Frage bearbeiten", robots: { index: false } };

export default async function FrageBearbeitenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { question, demo } = await getQuestion(id);
  if (!question || demo) notFound();
  const session = await requireUser(`/fragen/${id}/bearbeiten`);
  // Serverseitige Berechtigungsprüfung
  if (question.author_id !== session.userId && !hasRole(session, "moderator")) redirect(`/fragen/${id}`);

  return (
    <>
      <PageHeader title="Frage bearbeiten" crumbs={[{ href: "/fragen", label: "Fragen" }, { href: `/fragen/${id}`, label: question.title }, { label: "Bearbeiten" }]} />
      <Container className="max-w-3xl py-10">
        <div className="surface p-6">
          <QuestionForm questionId={id} initial={{ title: question.title, body: question.body, category: question.category }} />
        </div>
      </Container>
    </>
  );
}
