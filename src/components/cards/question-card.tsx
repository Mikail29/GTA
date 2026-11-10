import Link from "next/link";
import { Heart, MessageCircle, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/community/avatar";
import { communityCategoryName } from "@/data/categories";
import { formatDate } from "@/lib/utils/format";
import type { Question } from "@/types/community";

export function QuestionCard({ question }: { question: Question }) {
  return (
    <article className={`surface group relative flex gap-4 p-5 transition hover:border-pink/40 ${question.is_pinned ? "border-teal/40" : ""}`}>
      <Avatar name={question.author?.username ?? "Gelöscht"} url={question.author?.avatar_url ?? null} />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          {question.is_pinned && (
            <Badge accent="sunset">
              <Pin className="size-3" aria-hidden="true" /> Angeheftet
            </Badge>
          )}
          <Badge accent="teal">{communityCategoryName(question.category)}</Badge>
          {question.is_official && <Badge accent="pink">Team</Badge>}
          {question.status === "beantwortet" && <Badge accent="pink">Beantwortet</Badge>}
          {question.demo && !question.is_official && <Badge accent="violet">Demo</Badge>}
        </div>
        <h3 className="font-semibold leading-snug">
          <Link href={`/fragen/${question.id}`} className="after:absolute after:inset-0 group-hover:text-pink">
            {question.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{question.body}</p>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
          <span>{question.is_official ? "5-Sterne-Kompass Team" : (question.author?.username ?? "Gelöschtes Konto")}</span>
          <time dateTime={question.created_at}>{formatDate(question.created_at)}</time>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="size-3.5" aria-hidden="true" /> {question.answers_count}
          </span>
          <span className="inline-flex items-center gap-1">
            <Heart className="size-3.5" aria-hidden="true" /> {question.likes_count}
          </span>
        </div>
      </div>
    </article>
  );
}
