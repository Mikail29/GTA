import { CalendarClock, MessageSquarePlus } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

/** Hinweis: Inhalte werden nach dem Release (19.11.2026) Schritt für Schritt ergänzt. */
export function ReleasePending({ what }: { what: string }) {
  return (
    <section className="surface relative overflow-hidden border-sunset/30 p-6 sm:p-8" aria-labelledby="folgt-titel">
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-sunset/15 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sunset/15 text-sunset">
          <CalendarClock className="size-7" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <h2 id="folgt-titel" className="text-xl font-bold">
            Inhalte folgen in Kürze
          </h2>
          <p className="mt-1 text-muted">
            GTA 6 ist seit dem 19. November 2026 erhältlich. {what} tragen wir jetzt Schritt für Schritt ein – sobald wir sie geprüft haben. Bis dahin gibt es hier bewusst keine Vermutungen.
          </p>
        </div>
        <LinkButton href="/fragen/neu" variant="secondary" className="self-start sm:self-center">
          <MessageSquarePlus className="size-4" aria-hidden="true" /> Hinweis teilen
        </LinkButton>
      </div>
    </section>
  );
}
