"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Merkt sich, welche Seiten man auf dieser Website nacheinander geöffnet hat.
const trail: string[] = [];
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const snapshot = () => trail.join("\n");

function record(path: string) {
  if (trail[trail.length - 1] === path) return;
  if (trail[trail.length - 2] === path) trail.pop(); // man ist zurückgegangen
  else trail.push(path);
  listeners.forEach((l) => l());
}

/** Gibt es von dieser Seite aus eine vorherige Seite auf dieser Website? */
function hasPrevious(list: string[], path: string) {
  if (list[list.length - 1] === path) return list.length > 1; // Seite ist schon gemerkt
  if (list[list.length - 2] === path) return list.length > 2; // man ist gerade zurückgegangen
  return list.length > 0; // neue Seite – die bisher letzte ist die vorherige
}

/**
 * Knopf oben links: geht pro Klick eine Seite zurück – auf jeder Seite an derselben Stelle.
 * Ohne vorherige Seite geht es zur Startseite; auf der Startseite ist er dann ausgegraut.
 */
export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const saved = useSyncExternalStore(subscribe, snapshot, () => "");

  useEffect(() => {
    record(pathname);
  }, [pathname]);

  const canGoBack = hasPrevious(saved ? saved.split("\n") : [], pathname);
  const disabled = pathname === "/" && !canGoBack;

  const goBack = () => {
    if (canGoBack) router.back();
    else router.push("/");
  };

  return (
    <button
      type="button"
      onClick={goBack}
      disabled={disabled}
      aria-label={disabled ? "Zurück – nicht möglich, du bist auf der Startseite" : "Einen Schritt zurück"}
      title={disabled ? "Du bist schon auf der Startseite" : "Zurück"}
      className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center gap-1.5 rounded-full border border-line bg-card px-2.5 text-sm font-medium text-muted transition enabled:hover:border-pink/50 enabled:hover:text-white disabled:cursor-default disabled:opacity-40 md:pr-4"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      <span className="hidden md:inline">Zurück</span>
    </button>
  );
}
