import Link from "next/link";
import { MessageSquarePlus, Pin, Rocket, UserPlus, Users } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import type { Question } from "@/types/community";

const steps = [
  { Icon: UserPlus, title: "Konto erstellen", text: "Kostenlos, ohne Werbung, ohne Tracking – in einer Minute fertig." },
  { Icon: Users, title: "Hallo sagen", text: "Stell dich im Vorstellungs-Thread kurz vor." },
  { Icon: MessageSquarePlus, title: "Fragen & helfen", text: "Stell deine Fragen und hilf anderen mit deinen Antworten." },
];

/** Einstiegsbereich „GTA 6 Starter“ mit Schritten und angehefteten Threads. */
export function StarterSection({ threads, loggedIn }: { threads: Question[]; loggedIn: boolean }) {
  return (
    <section id="starter" aria-labelledby="starter-title" className="relative scroll-mt-24 overflow-hidden rounded-[2rem] border border-teal/30 bg-gradient-to-br from-[#0f2a3a] via-card to-[#2a1450] p-6 sm:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-pink/20 blur-3xl" />
      <div className="relative">
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          <Rocket className="size-4" aria-hidden="true" /> GTA 6 Starter
        </p>
        <h2 id="starter-title" className="max-w-2xl text-2xl font-bold sm:text-4xl">
          Neu hier? <span className="text-gradient">Hier geht&apos;s los.</span>
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Der Treffpunkt für alle, die mit GTA 6 starten. Stell dich vor, stell Einsteigerfragen und hilf anderen – gemeinsam kommt man schneller durch Vice City.
        </p>

        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map(({ Icon, title, text }, i) => (
            <li key={title} className="rounded-2xl border border-line bg-night/50 p-5">
              <span className="mb-3 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-pink to-violet text-sm font-bold">{i + 1}</span>
                <Icon className="size-5 text-teal" aria-hidden="true" />
              </span>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-3">
          {loggedIn ? (
            <LinkButton href="/fragen/neu">
              <MessageSquarePlus className="size-4" aria-hidden="true" /> Erste Frage stellen
            </LinkButton>
          ) : (
            <LinkButton href="/registrieren">
              <UserPlus className="size-4" aria-hidden="true" /> Kostenlos beitreten
            </LinkButton>
          )}
          <LinkButton href="/fragen?kategorie=starter" variant="secondary" className="bg-night/60">
            Alle Starter-Fragen
          </LinkButton>
        </div>

        {threads.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Pin className="size-4 text-sunset" aria-hidden="true" /> Angeheftete Starter-Threads
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {threads.map((t) => (
                <li key={t.id}>
                  <Link href={`/fragen/${t.id}`} className="flex h-full items-center gap-3 rounded-2xl border border-line bg-night/50 px-4 py-3 text-sm font-medium transition hover:border-teal/50 hover:text-teal">
                    <span className="size-2 shrink-0 rounded-full bg-teal" aria-hidden="true" />
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
