"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Merkt sich, welche Seiten man auf dieser Website nacheinander geöffnet hat.
const trail: string[] = [];

/** Knopf oben links: geht pro Klick eine Seite zurück. Auf der Startseite ausgeblendet. */
export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (trail[trail.length - 1] === pathname) return;
    if (trail[trail.length - 2] === pathname) trail.pop(); // man ist zurückgegangen
    else trail.push(pathname);
  }, [pathname]);

  if (pathname === "/") return null;

  const goBack = () => {
    // Gibt es auf dieser Website eine vorherige Seite, dorthin zurück – sonst zur Startseite.
    if (trail.length > 1) router.back();
    else router.push("/");
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Einen Schritt zurück"
      title="Zurück"
      className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-card text-muted transition hover:border-pink/50 hover:text-white"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
    </button>
  );
}
