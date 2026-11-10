"use client";

import { useRef, useState, useTransition } from "react";
import { Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/forms/field";
import { reportAction } from "@/lib/community/actions";
import { reportReasonLabels, reportReasons } from "@/lib/validations/community";

/** Meldefunktion mit nativem <dialog> (Fokus-Management und Escape inklusive). */
export function ReportButton({ targetType, targetId, canInteract }: { targetType: "question" | "answer" | "comment"; targetId: string; canInteract: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const open = () => {
    setResult(canInteract ? null : { ok: false, message: "Bitte melde dich an, um Inhalte zu melden." });
    dialogRef.current?.showModal();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await reportAction({ targetType, targetId, reason, details });
      setResult(res);
    });
  };

  return (
    <>
      <button type="button" onClick={open} className="inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-xs text-muted transition hover:text-sunset">
        <Flag className="size-3.5" aria-hidden="true" /> Melden
      </button>
      <dialog ref={dialogRef} className="surface m-auto w-[min(92vw,28rem)] p-0 text-white backdrop:bg-night/80 backdrop:backdrop-blur-sm" aria-labelledby={`report-${targetId}`}>
        <form onSubmit={submit} className="grid gap-4 p-6">
          <h2 id={`report-${targetId}`} className="text-lg font-bold">
            Inhalt melden
          </h2>
          {canInteract && !result?.ok && (
            <>
              <fieldset className="grid gap-2">
                <legend className="mb-1 text-sm text-muted">Warum möchtest du diesen Inhalt melden?</legend>
                {reportReasons.map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-pink" required />
                    {reportReasonLabels[r]}
                  </label>
                ))}
              </fieldset>
              <label className="grid gap-1.5 text-sm">
                Details (optional)
                <textarea value={details} onChange={(e) => setDetails(e.target.value.slice(0, 500))} rows={3} className={inputClass} />
              </label>
            </>
          )}
          {result && (
            <p role="status" className={result.ok ? "text-sm text-success" : "text-sm text-sunset"}>
              {result.message}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => dialogRef.current?.close()}>
              Schließen
            </Button>
            {canInteract && !result?.ok && (
              <Button type="submit" disabled={pending || !reason}>
                {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />} Meldung senden
              </Button>
            )}
          </div>
        </form>
      </dialog>
    </>
  );
}
