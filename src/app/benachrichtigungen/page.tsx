import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Flag, ShieldAlert, Info, Ban } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { MarkReadButton } from "@/components/community/mark-read-button";
import { requireUser } from "@/lib/auth/session";
import { listNotifications } from "@/lib/community/notifications";
import { formatDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Benachrichtigungen", robots: { index: false } };

const icons = { moderation: ShieldAlert, sperre: Ban, meldung: Flag, info: Info };

export default async function BenachrichtigungenPage() {
  const session = await requireUser("/benachrichtigungen");
  const items = await listNotifications(session.userId);
  const unread = items.filter((n) => !n.read_at).length;

  return (
    <>
      <PageHeader title="Benachrichtigungen" text="Hier informieren wir dich über Moderationsentscheidungen und das Ergebnis deiner Meldungen." crumbs={[{ href: "/profil", label: "Profil" }, { label: "Benachrichtigungen" }]} />
      <Container className="max-w-3xl py-10">
        {items.length === 0 ? (
          <EmptyState title="Keine Benachrichtigungen" text="Sobald es Neuigkeiten zu deinen Beiträgen oder Meldungen gibt, erscheinen sie hier." />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm text-muted" role="status">
                {unread} ungelesen
              </p>
              {unread > 0 && <MarkReadButton />}
            </div>
            <ul className="grid gap-3">
              {items.map((n) => {
                const Icon = icons[n.kind] ?? Bell;
                return (
                  <li key={n.id} className={cn("surface flex gap-4 p-5", !n.read_at && "border-pink/40")}>
                    <Icon className={cn("mt-0.5 size-5 shrink-0", n.kind === "meldung" ? "text-teal" : "text-sunset")} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm text-white/90">{n.message}</p>
                      <p className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                        <time dateTime={n.created_at}>{formatDateTime(n.created_at)}</time>
                        {!n.read_at && <span className="text-pink">neu</span>}
                        {n.link && (
                          <Link href={n.link} className="text-teal underline">
                            Zum Beitrag
                          </Link>
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-xs text-muted">
              Du hältst eine Entscheidung für falsch? Schreib uns über die{" "}
              <Link href="/kontakt" className="text-teal underline">
                Kontaktseite
              </Link>{" "}
              – wir prüfen sie erneut.
            </p>
          </>
        )}
      </Container>
    </>
  );
}
