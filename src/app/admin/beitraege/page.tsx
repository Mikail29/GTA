import Link from "next/link";
import { requireStaff } from "@/lib/admin/guard";
import { ActionButton } from "@/components/admin/action-button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { setHiddenAction, setPinnedAction, setQuestionStatusAction } from "@/lib/admin/actions";
import { formatDateTime } from "@/lib/utils/format";

interface Row {
  id: string;
  title: string;
  status: "offen" | "beantwortet" | "geschlossen";
  is_hidden: boolean;
  is_pinned: boolean;
  created_at: string;
  answers_count: number;
  author: { username: string } | null;
}

export default async function BeitraegePage() {
  const { supabase } = await requireStaff("moderator");
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("questions")
    .select("id, title, status, is_hidden, is_pinned, created_at, answers_count, author:profiles!questions_author_id_fkey(username)")
    .order("created_at", { ascending: false })
    .limit(100)
    .returns<Row[]>();

  return (
    <div>
      <h1 className="text-3xl font-bold">Beiträge verwalten</h1>
      <p className="mt-1 mb-6 text-muted">Die neuesten 100 Fragen inklusive ausgeblendeter Beiträge.</p>
      {error ? (
        <p role="alert" className="text-danger">
          Beiträge konnten nicht geladen werden.
        </p>
      ) : !data?.length ? (
        <EmptyState title="Noch keine Beiträge" />
      ) : (
        <ul className="grid gap-3">
          {data.map((q) => (
            <li key={q.id} className="surface grid gap-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/fragen/${q.id}`} className="font-semibold hover:text-pink">
                  {q.title}
                </Link>
                {q.is_hidden && <Badge accent="sunset">ausgeblendet</Badge>}
                {q.is_pinned && <Badge accent="teal">angeheftet</Badge>}
                <Badge>{q.status}</Badge>
              </div>
              <p className="text-xs text-muted">
                {q.author?.username ?? "Gelöschtes Konto"} · {formatDateTime(q.created_at)} · {q.answers_count} Antworten
              </p>
              <div className="flex flex-wrap gap-2">
                {q.is_hidden ? (
                  <ActionButton action={setHiddenAction.bind(null, "questions", q.id, false)} tone="success">
                    Wieder einblenden
                  </ActionButton>
                ) : (
                  <ActionButton action={setHiddenAction.bind(null, "questions", q.id, true)} tone="danger">
                    Ausblenden
                  </ActionButton>
                )}
                <ActionButton action={setPinnedAction.bind(null, q.id, !q.is_pinned)}>{q.is_pinned ? "Lösen" : "Anheften"}</ActionButton>
                {q.status !== "geschlossen" ? (
                  <ActionButton action={setQuestionStatusAction.bind(null, q.id, "geschlossen")}>Schließen</ActionButton>
                ) : (
                  <ActionButton action={setQuestionStatusAction.bind(null, q.id, "offen")}>Wieder öffnen</ActionButton>
                )}
                {q.status === "offen" && <ActionButton action={setQuestionStatusAction.bind(null, q.id, "beantwortet")}>Als beantwortet markieren</ActionButton>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
