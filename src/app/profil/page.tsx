import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, KeyRound, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { AvatarForm, ProfileForm } from "@/components/auth/profile-forms";
import { requireUser, hasRole } from "@/lib/auth/session";
import { listUserQuestions } from "@/lib/community/queries";
import { signOutAction } from "@/lib/auth/actions";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Mein Profil", robots: { index: false } };

const roleLabel = { user: "Mitglied", moderator: "Moderator", admin: "Administrator" } as const;

export default async function ProfilPage() {
  const session = await requireUser("/profil");
  const profile = session.profile;

  if (!profile) {
    return (
      <Container className="py-16">
        <Notice tone="error" title="Profil nicht gefunden">
          Zu deinem Konto existiert noch kein Profil. Bitte melde dich ab und erneut an. Besteht das Problem weiter, kontaktiere uns.
        </Notice>
      </Container>
    );
  }
  const questions = await listUserQuestions(session.userId);

  return (
    <>
      <PageHeader title="Mein Profil" crumbs={[{ label: "Profil" }]} />
      <Container className="grid gap-8 py-10 lg:grid-cols-[300px_1fr]">
        <aside className="grid content-start gap-4">
          <div className="surface p-6">
            <AvatarForm username={profile.username} avatarUrl={profile.avatar_url} />
          </div>
          <div className="surface grid gap-3 p-5 text-sm">
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-teal" aria-hidden="true" /> Rolle: <Badge accent="teal">{roleLabel[profile.role]}</Badge>
            </p>
            <p className="flex items-center gap-2 text-muted">
              <CalendarDays className="size-4" aria-hidden="true" /> Registriert am {formatDate(profile.created_at)}
            </p>
            {session.email && <p className="truncate text-muted">E-Mail: {session.email}</p>}
          </div>
          <div className="grid gap-2">
            {hasRole(session, "moderator") && (
              <LinkButton href="/admin" variant="secondary">
                <LayoutDashboard className="size-4" aria-hidden="true" /> Verwaltung
              </LinkButton>
            )}
            <LinkButton href="/passwort-neu" variant="secondary">
              <KeyRound className="size-4" aria-hidden="true" /> Passwort ändern
            </LinkButton>
            <form action={signOutAction}>
              <Button type="submit" variant="danger" className="w-full">
                <LogOut className="size-4" aria-hidden="true" /> Abmelden
              </Button>
            </form>
          </div>
        </aside>
        <div className="grid content-start gap-8">
          <section className="surface p-6" aria-labelledby="profil-daten">
            <h2 id="profil-daten" className="mb-5 text-xl font-bold">
              Profildaten
            </h2>
            <ProfileForm initial={{ username: profile.username, bio: profile.bio ?? "" }} />
          </section>
          <section className="surface p-6" aria-labelledby="meine-fragen">
            <h2 id="meine-fragen" className="mb-4 text-xl font-bold">
              Meine Fragen
            </h2>
            {questions.length ? (
              <ul className="divide-y divide-line">
                {questions.map((q) => (
                  <li key={q.id} className="flex items-center justify-between gap-4 py-3">
                    <Link href={`/fragen/${q.id}`} className="min-w-0 truncate hover:text-pink">
                      {q.title}
                    </Link>
                    <span className="shrink-0 text-xs text-muted">
                      {q.is_hidden ? "ausgeblendet · " : ""}
                      {q.answers_count} Antworten
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">
                Du hast noch keine Fragen gestellt.{" "}
                <Link href="/fragen/neu" className="text-teal underline">
                  Jetzt fragen
                </Link>
              </p>
            )}
          </section>
          <Notice tone="info" title="Deine Daten">
            Du kannst jederzeit Auskunft über deine gespeicherten Daten oder die Löschung deines Kontos verlangen. Nutze dafür die{" "}
            <Link href="/kontakt" className="text-teal underline">
              Kontaktseite
            </Link>
            . Details findest du in der{" "}
            <Link href="/datenschutz" className="text-teal underline">
              Datenschutzerklärung
            </Link>
            .
          </Notice>
        </div>
      </Container>
    </>
  );
}
