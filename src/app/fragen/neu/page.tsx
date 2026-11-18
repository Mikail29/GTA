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
import { param, type SearchParams } from "@/lib/utils/params";

const isMitteilung = (sp: Awaited<SearchParams>) => param(sp.art) === "mitteilung";

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  return { title: isMitteilung(await searchParams) ? "Etwas mitteilen" : "Frage stellen", robots: { index: false } };
}

export default async function NeueFragePage({ searchParams }: { searchParams: SearchParams }) {
  const mitteilung = isMitteilung(await searchParams);
  const configured = isSupabaseConfigured();
  const session = configured ? await getSession() : null;

  return (
    <>
      <PageHeader
        title={mitteilung ? "Ich möchte etwas mitteilen" : "Ich habe eine Frage"}
        text={mitteilung ? "Teile einen Tipp, eine Entdeckung oder eine Info mit der Community." : "Beschreibe dein Anliegen – so bekommst du schneller hilfreiche Antworten."}
        crumbs={[{ href: "/fragen", label: "Fragen" }, { label: mitteilung ? "Neue Mitteilung" : "Neue Frage" }]}
      />
      <Container className="grid max-w-3xl gap-6 py-10">
        {!configured ? (
          <CommunityDemoNotice />
        ) : !session ? (
          <div className="surface flex flex-col items-start gap-4 p-6">
            <p className="text-muted">Lesen kannst du alles ohne Konto. Um {mitteilung ? "etwas mitzuteilen" : "eine Frage zu stellen"}, brauchst du ein kostenloses Konto – das schützt die Community vor Spam.</p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href={`/login?next=${encodeURIComponent(mitteilung ? "/fragen/neu?art=mitteilung" : "/fragen/neu")}`}>
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
            <Notice tone="info" title={mitteilung ? "Bevor du schreibst" : "Bevor du fragst"}>
              {mitteilung ? "Bitte halte dich an die Community-Regeln und kennzeichne Spoiler." : "Nutze zuerst die Suche – vielleicht gibt es schon eine Antwort. Bitte halte dich an die Community-Regeln und kennzeichne Spoiler."}
            </Notice>
            <div className="surface p-6">
              <QuestionForm kind={mitteilung ? "mitteilung" : "frage"} />
            </div>
          </>
        )}
      </Container>
    </>
  );
}
