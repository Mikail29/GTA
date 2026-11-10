"use client";

import { useSyncExternalStore } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * „War dieser Beitrag hilfreich?“
 * Die Bewertung wird datenschutzfreundlich nur lokal im Browser gespeichert.
 * Eine zentrale Auswertung (Tabelle article_ratings) ist als offene Funktion dokumentiert.
 */
const listeners = new Set<() => void>();
const keyFor = (id: string) => `gta6k-rating:${id}`;

function readRating(id: string): "up" | "down" | null {
  try {
    const v = localStorage.getItem(keyFor(id));
    return v === "up" || v === "down" ? v : null;
  } catch {
    return null;
  }
}

export function Rating({ id }: { id: string }) {
  const value = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => readRating(id),
    () => null,
  );

  const set = (v: "up" | "down") => {
    try {
      localStorage.setItem(keyFor(id), v);
    } catch {}
    listeners.forEach((l) => l());
  };

  return (
    <div className="surface flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-semibold">War dieser Beitrag hilfreich?</p>
      <div className="flex items-center gap-2" role="group" aria-label="Beitrag bewerten">
        {(
          [
            ["up", "Ja", ThumbsUp],
            ["down", "Nein", ThumbsDown],
          ] as const
        ).map(([v, label, Icon]) => (
          <button
            key={v}
            type="button"
            aria-pressed={value === v}
            onClick={() => set(v)}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition",
              value === v ? (v === "up" ? "border-teal bg-teal/15 text-teal" : "border-pink bg-pink/15 text-pink") : "border-line bg-card text-muted hover:text-white",
            )}
          >
            <Icon className="size-4" aria-hidden="true" /> {label}
          </button>
        ))}
        <span role="status" className="ml-1 text-xs text-muted">
          {value ? "Danke für dein Feedback!" : ""}
        </span>
      </div>
    </div>
  );
}
