import Link from "next/link";
import { requireStaff } from "@/lib/admin/guard";
import { ActionButton } from "@/components/admin/action-button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { resolveReportAction, setHiddenAction } from "@/lib/admin/actions";
import { reportReasonLabels } from "@/lib/validations/community";
import { formatDateTime } from "@/lib/utils/format";
import { param, type SearchParams } from "@/lib/utils/params";

interface ReportRow {
  id: string;
  target_type: "question" | "answer" | "comment";
  target_id: string;
  reason: keyof typeof reportReasonLabels;
  details: string | null;
  status: string;
  created_at: string;
  reporter: { username: string } | null;
}

const tableFor = { question: "questions", answer: "answers", comment: "comments" } as const;
const typeLabel = { question: "Frage", answer: "Antwort", comment: "Kommentar" } as const;

export default async function MeldungenPage({ searchParams }: { searchParams: SearchParams }) {
  const { supabase } = await requireStaff("moderator");
  if (!supabase) return null;
  const status = param((await searchParams).status) === "alle" ? "alle" : "offen";

  let query = supabase
    .from("reports")
    .select("id, target_type, target_id, reason, details, status, created_at, reporter:profiles!reports_reporter_id_fkey(username)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (status === "offen") query = query.eq("status", "offen");
  const { data, error } = await query.returns<ReportRow[]>();

  // Für Antworten/Kommentare die zugehörige Frage ermitteln, um verlinken zu können
  const answerIds = (data ?? []).filter((r) => r.target_type === "answer").map((r) => r.target_id);
  const { data: answerRows } = answerIds.length ? await supabase.from("answers").select("id, question_id").in("id", answerIds) : { data: [] };
  const questionOf = new Map((answerRows ?? []).map((a: { id: string; question_id: string }) => [a.id, a.question_id]));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gemeldete Inhalte</h1>
          <p className="mt-1 text-muted">Prüfe Meldungen, blende Inhalte aus oder lehne Meldungen ab.</p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link href="/admin/meldungen" className={status === "offen" ? "text-pink" : "text-muted hover:text-white"}>
            Offen
          </Link>
          <span className="text-muted">·</span>
          <Link href="/admin/meldungen?status=alle" className={status === "alle" ? "text-pink" : "text-muted hover:text-white"}>
            Alle
          </Link>
        </div>
      </div>
      {error ? (
        <p role="alert" className="text-danger">
          Meldungen konnten nicht geladen werden.
        </p>
      ) : !data?.length ? (
        <EmptyState title="Keine Meldungen" text="Aktuell gibt es nichts zu prüfen. 🎉" />
      ) : (
        <ul className="grid gap-3">
          {data.map((r) => {
            const qid = r.target_type === "question" ? r.target_id : questionOf.get(r.target_id);
            return (
              <li key={r.id} className="surface grid gap-3 p-5">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge accent="sunset">{reportReasonLabels[r.reason] ?? r.reason}</Badge>
                  <Badge>{typeLabel[r.target_type]}</Badge>
                  <Badge accent={r.status === "offen" ? "pink" : "teal"}>{r.status}</Badge>
                  <span className="text-xs text-muted">
                    von {r.reporter?.username ?? "unbekannt"} · {formatDateTime(r.created_at)}
                  </span>
                </div>
                {r.details && <p className="whitespace-pre-wrap text-sm text-white/85">„{r.details}“</p>}
                <div className="flex flex-wrap items-center gap-2">
                  {qid && (
                    <Link href={`/fragen/${qid}`} className="text-sm text-teal underline" target="_blank">
                      Inhalt ansehen
                    </Link>
                  )}
                  <ActionButton action={setHiddenAction.bind(null, tableFor[r.target_type], r.target_id, true)} tone="danger">
                    Inhalt ausblenden
                  </ActionButton>
                  {r.status === "offen" && (
                    <>
                      <ActionButton action={resolveReportAction.bind(null, r.id, "erledigt")} tone="success">
                        Als erledigt markieren
                      </ActionButton>
                      <ActionButton action={resolveReportAction.bind(null, r.id, "abgelehnt")}>Ablehnen</ActionButton>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
