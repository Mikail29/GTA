"use client";

import { useState, useTransition } from "react";
import { Loader2, MessageCircle, Pencil } from "lucide-react";
import { Avatar } from "./avatar";
import { LikeButton } from "./like-button";
import { ReportButton } from "./report-button";
import { DeleteButton } from "./delete-button";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/forms/field";
import { createCommentAction, deleteAnswerAction, deleteCommentAction, updateAnswerAction } from "@/lib/community/actions";
import { formatDateTime } from "@/lib/utils/format";
import type { Answer, Comment } from "@/types/community";

interface Viewer {
  id: string | null;
  isModerator: boolean;
}

export function AnswerItem({ answer, comments, liked, viewer, demo }: { answer: Answer; comments: Comment[]; liked: boolean; viewer: Viewer; demo: boolean }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(answer.body);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const canInteract = Boolean(viewer.id) && !demo;
  const canEdit = canInteract && (viewer.id === answer.author_id || viewer.isModerator);

  const save = () =>
    startTransition(async () => {
      const res = await updateAnswerAction(answer.id, answer.question_id, body);
      setMessage(res);
      if (res.ok) setEditing(false);
    });

  const sendComment = () =>
    startTransition(async () => {
      const res = await createCommentAction(answer.id, answer.question_id, comment);
      setMessage(res);
      if (res.ok) {
        setComment("");
        setCommentOpen(false);
      }
    });

  return (
    <article className="surface p-5" aria-label={`Antwort von ${answer.author?.username ?? "gelöschtem Konto"}`}>
      <header className="mb-3 flex items-center gap-3">
        <Avatar name={answer.author?.username ?? "?"} url={answer.author?.avatar_url ?? null} size={34} />
        <div className="text-sm">
          <p className="font-semibold">{answer.author?.username ?? "Gelöschtes Konto"}</p>
          <p className="text-xs text-muted">
            <time dateTime={answer.created_at}>{formatDateTime(answer.created_at)}</time>
            {answer.updated_at && " · bearbeitet"}
          </p>
        </div>
      </header>

      {editing ? (
        <div className="grid gap-3">
          <label htmlFor={`edit-${answer.id}`} className="sr-only">
            Antwort bearbeiten
          </label>
          <textarea id={`edit-${answer.id}`} value={body} onChange={(e) => setBody(e.target.value.slice(0, 5000))} rows={5} className={inputClass} />
          <div className="flex gap-2">
            <Button size="sm" onClick={save} disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />} Speichern
            </Button>
            <Button size="sm" variant="ghost" onClick={() => (setEditing(false), setBody(answer.body))}>
              Abbrechen
            </Button>
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap break-words text-white/90">{answer.body}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-1">
        <LikeButton targetType="answer" targetId={answer.id} questionId={answer.question_id} count={answer.likes_count} liked={liked} canInteract={canInteract} />
        {canInteract && (
          <button type="button" onClick={() => setCommentOpen((v) => !v)} className="inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-xs text-muted hover:text-white" aria-expanded={commentOpen}>
            <MessageCircle className="size-3.5" aria-hidden="true" /> Kommentieren
          </button>
        )}
        {canEdit && !editing && (
          <button type="button" onClick={() => setEditing(true)} className="inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-xs text-muted hover:text-white">
            <Pencil className="size-3.5" aria-hidden="true" /> Bearbeiten
          </button>
        )}
        {canEdit && <DeleteButton action={() => deleteAnswerAction(answer.id, answer.question_id)} />}
        {!demo && <ReportButton targetType="answer" targetId={answer.id} canInteract={canInteract} />}
      </div>

      {message && (
        <p role={message.ok ? "status" : "alert"} className={message.ok ? "mt-2 text-xs text-success" : "mt-2 text-xs text-danger"}>
          {message.message}
        </p>
      )}

      {(comments.length > 0 || commentOpen) && (
        <div className="mt-4 grid gap-3 border-l-2 border-line pl-4">
          {comments.map((c) => (
            <div key={c.id} className="text-sm">
              <p className="whitespace-pre-wrap break-words text-white/85">{c.body}</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                {c.author?.username ?? "Gelöschtes Konto"} · <time dateTime={c.created_at}>{formatDateTime(c.created_at)}</time>
                {canInteract && (viewer.id === c.author_id || viewer.isModerator) && <DeleteButton action={() => deleteCommentAction(c.id, answer.question_id)} />}
                {!demo && <ReportButton targetType="comment" targetId={c.id} canInteract={canInteract} />}
              </p>
            </div>
          ))}
          {commentOpen && (
            <div className="grid gap-2">
              <label htmlFor={`comment-${answer.id}`} className="sr-only">
                Kommentar schreiben
              </label>
              <textarea id={`comment-${answer.id}`} value={comment} onChange={(e) => setComment(e.target.value.slice(0, 1000))} rows={2} placeholder="Kurzer Kommentar…" className={inputClass} />
              <div>
                <Button size="sm" onClick={sendComment} disabled={pending || comment.trim().length < 2}>
                  Kommentar senden
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
