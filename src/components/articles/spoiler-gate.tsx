"use client";

import { useState } from "react";
import { Eye, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Blendet Spoiler-Inhalte aus, bis die Person sie aktiv aufdeckt.
 * Ohne JavaScript bleibt der Inhalt über <noscript> erreichbar.
 */
export function SpoilerGate({ level, children }: { level: "leicht" | "stark"; children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  if (revealed) return <>{children}</>;
  return (
    <div className="relative">
      <div className="surface flex flex-col items-center gap-4 border-pink/40 px-6 py-12 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-pink/15 text-pink">
          <TriangleAlert className="size-7" aria-hidden="true" />
        </span>
        <h2 className="text-xl font-bold">{level === "stark" ? "Achtung: starke Spoiler" : "Achtung: leichte Spoiler"}</h2>
        <p className="max-w-md text-sm text-muted">
          Diese Komplettlösung verrät {level === "stark" ? "wichtige Teile der Handlung" : "einzelne Details des Ablaufs"}. Möchtest du die Inhalte wirklich sehen?
        </p>
        <Button onClick={() => setRevealed(true)}>
          <Eye className="size-4" aria-hidden="true" /> Spoiler anzeigen
        </Button>
      </div>
      <noscript>{children}</noscript>
    </div>
  );
}
