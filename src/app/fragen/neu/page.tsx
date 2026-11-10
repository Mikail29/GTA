import type { Metadata } from "next";
import { LogIn } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { QuestionForm } from "@/components/community/question-form";
import { CommunityDemoNotice } from "@/components/community/demo-notice";
import { getSession } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Frage stellen", robots: { index: false } };

export default async function NeueFragePage() {
  const configured = isSupabaseConfigured();
  const session = configured ? await getSession() : null;

  return (
    <>
      <PageHeader title="Frage stellen" text="Beschreibe dein Anliegen möglichst genau – so bekommst du schneller hilfreiche Antworten." crumbs={[{ href: "/fragen", label: "Fragen" }, { label: "Neue Frage" }]} />
      <Container className="grid max-w-3xl gap-6 py-10">
        {!configured ? (
          <CommunityDemoNotice />
        ) : !session ? (
          <div className="surface flex flex-col items-start gap-4 p-6">
            <p className="text-muted">Lesen kannst du alles ohne Konto. Um eine Frage zu stellen, brauchst du ein kostenloses Konto – das schützt die Community vor Spam.</p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/login?next=/fragen/neu">
                <LogIn className="size-4" aria-hidden="true" /> Anmelden
              </LinkButton>
              <LinkButton href="/registrieren" variant="secondary">
                Kostenlos registrieren
              </LinkButton>
            </div>
          </div>
        ) : session.profile?.is_banned ? (
          <Notice tone="error">Dein Konto ist für neue Beiträge gesperrt. Bei Fragen wende dich an das Moderationsteam.</Notice>
        ) : (
          <>
            <Notice tone="info" title="Bevor du fragst">
              Nutze zuerst die Suche – vielleicht gibt es schon eine Antwort. Bitte halte dich an die Community-Regeln und kennzeichne Spoiler.
            </Notice>
            <div className="surface p-6">
              <QuestionForm />
            </div>
          </>
        )}
      </Container>
    </>
  );
}
