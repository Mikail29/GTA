"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Honeypot, inputClass } from "@/components/forms/field";
import { guestReportAction, reportAction } from "@/lib/community/actions";
import { reportReasonLabels, reportReasons } from "@/lib/validations/community";

/**
 * Meldefunktion mit nativem <dialog> (Fokus-Management und Escape inklusive).
 * Angemeldete Nutzer melden mit ihrem Konto, Gäste ohne Konto (Pflicht nach Digital Services Act).
 */
export function ReportButton({ targetType, targetId, canInteract }: { targetType: "question" | "answer" | "comment"; targetId: string; canInteract: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [goodFaith, setGoodFaith] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const isGuest = !canInteract;
  const titleId = `report-${targetType}-${targetId}`;

  const open = () => {
    setResult(null);
    dialogRef.current?.showModal();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = isGuest
        ? await guestReportAction({ targetType, targetId, reason, details, email, goodFaith, website })
        : await reportAction({ targetType, targetId, reason, details, goodFaith });
      setResult(res);
    });
  };

  return (
    <>
      <button type="button" onClick={open} className="inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-xs text-muted transition hover:text-sunset">
        <Flag className="size-3.5" aria-hidden="true" /> Melden
      </button>
      <dialog ref={dialogRef} className="surface m-auto max-h-[90dvh] w-[min(92vw,30rem)] overflow-y-auto p-0 text-white backdrop:bg-night/80 backdrop:backdrop-blur-sm" aria-labelledby={titleId}>
        <form onSubmit={submit} className="relative grid gap-4 p-6">
          <h2 id={titleId} className="text-lg font-bold">
            Inhalt melden
          </h2>
          {!result?.ok && (
            <>
              {isGuest && <p className="text-sm text-muted">Du kannst auch ohne Konto melden. Wir prüfen jede Meldung.</p>}
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
                Erklärung (empfohlen)
                <textarea value={details} onChange={(e) => setDetails(e.target.value.slice(0, 500))} rows={3} placeholder="Was genau ist das Problem?" className={inputClass} />
              </label>
              {isGuest && (
                <label className="grid gap-1.5 text-sm">
                  E-Mail-Adresse (optional)
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} autoComplete="email" className={inputClass} />
                  <span className="text-xs text-muted">Nur nötig, wenn du über das Ergebnis informiert werden möchtest.</span>
                </label>
              )}
              <label className="flex items-start gap-2 text-sm text-muted">
                <input type="checkbox" checked={goodFaith} onChange={(e) => setGoodFaith(e.target.checked)} className="mt-1 accent-pink" required />
                <span>Ich bestätige, dass meine Angaben nach bestem Wissen richtig und vollständig sind.</span>
              </label>
              {isGuest && <Honeypot value={website} onChange={(e) => setWebsite(e.target.value)} />}
              <p className="text-xs text-muted">
                Mehr zum Ablauf in den{" "}
                <Link href="/nutzungsbedingungen#melden" className="text-teal underline" target="_blank">
                  Nutzungsbedingungen
                </Link>
                .
              </p>
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
            {!result?.ok && (
              <Button type="submit" disabled={pending || !reason || !goodFaith}>
                {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />} Meldung senden
              </Button>
            )}
          </div>
        </form>
      </dialog>
    </>
  );
}
