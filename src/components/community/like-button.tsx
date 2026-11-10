"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toggleLikeAction } from "@/lib/community/actions";

export function LikeButton({ targetType, targetId, questionId, count, liked, canInteract }: { targetType: "question" | "answer"; targetId: string; questionId: string; count: number; liked: boolean; canInteract: boolean }) {
  const [pending, startTransition] = useTransition();
  const [state, setOptimistic] = useOptimistic({ count, liked }, (s, next: boolean) => ({ liked: next, count: s.count + (next ? 1 : -1) }));
  const [message, setMessage] = useState("");

  const click = () => {
    if (!canInteract) {
      setMessage("Bitte melde dich an, um Beiträge zu liken.");
      return;
    }
    startTransition(async () => {
      setOptimistic(!state.liked);
      const res = await toggleLikeAction(targetType, targetId, questionId);
      if (!res.ok) setMessage(res.message);
    });
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={click}
        disabled={pending}
        aria-pressed={state.liked}
        aria-label={state.liked ? "Gefällt mir entfernen" : "Gefällt mir"}
        className={cn("inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition", state.liked ? "border-pink/60 bg-pink/15 text-pink" : "border-line text-muted hover:border-pink/40 hover:text-white")}
      >
        <Heart className={cn("size-3.5", state.liked && "fill-current")} aria-hidden="true" /> {state.count}
      </button>
      {message && (
        <span role="status" className="text-xs text-sunset">
          {message}
        </span>
      )}
    </span>
  );
}
