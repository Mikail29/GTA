"use client";

import { useState, useTransition } from "react";
import { Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Honeypot, inputClass } from "./field";
import { guestReportAction } from "@/lib/community/actions";
import { reportReasonLabels, reportReasons } from "@/lib/validations/community";

/** Liest die Frage-ID aus einem Link wie https://…/fragen/<uuid>. */
function questionIdFromLink(link: string) {
  return link.match(/\/fragen\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i)?.[1];
}

/** Allgemeines Meldeformular für Inhalte (ohne Konto nutzbar). */
export function ReportForm({ initialLink = "" }: { initialLink?: string }) {
  const [link, setLink] = useState(initialLink);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [goodFaith, setGoodFaith] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = questionIdFromLink(link);
    if (!id) {
      setLinkError("Bitte füge den Link zur Frage ein, z. B. …/fragen/1234abcd-… (Beispielbeiträge können nicht gemeldet werden).");
      return;
    }
    setLinkError("");
    startTransition(async () => setResult(await guestReportAction({ targetType: "question", targetId: id, reason, details, email, goodFaith, website })));
  };

  if (result?.ok) return <FormMessage result={result} />;

  return (
    <form onSubmit={submit} className="relative grid gap-5" noValidate>
      <Field label="Link zum Inhalt" htmlFor="report-link" error={linkError} hint="Öffne die Frage und kopiere die Adresse aus der Adresszeile. Betrifft es eine Antwort oder einen Kommentar, beschreibe ihn unten.">
        <input id="report-link" type="url" value={link} onChange={(e) => setLink(e.target.value)} required aria-invalid={!!linkError} className={inputClass} />
      </Field>
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-medium">Grund der Meldung</legend>
        {reportReasons.map((r) => (
          <label key={r} className="flex items-center gap-2 text-sm">
            <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-pink" required />
            {reportReasonLabels[r]}
          </label>
        ))}
      </fieldset>
      <Field label="Erklärung" htmlFor="report-details" hint="Warum ist der Inhalt rechtswidrig oder regelwidrig? Max. 500 Zeichen.">
        <textarea id="report-details" value={details} onChange={(e) => setDetails(e.target.value.slice(0, 500))} rows={4} className={inputClass} />
      </Field>
      <Field label="E-Mail-Adresse (optional)" htmlFor="report-email" hint="Nur nötig, wenn du über das Ergebnis informiert werden möchtest.">
        <input id="report-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} autoComplete="email" className={inputClass} />
      </Field>
      <label className="flex items-start gap-2 text-sm text-muted">
        <input type="checkbox" checked={goodFaith} onChange={(e) => setGoodFaith(e.target.checked)} className="mt-1 accent-pink" required />
        <span>Ich bestätige, dass meine Angaben nach bestem Wissen richtig und vollständig sind.</span>
      </label>
      <Honeypot value={website} onChange={(e) => setWebsite(e.target.value)} />
      <FormMessage result={result} />
      <div>
        <Button type="submit" size="lg" disabled={pending || !reason || !goodFaith || !link}>
          {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Flag className="size-5" aria-hidden="true" />} Meldung senden
        </Button>
      </div>
    </form>
  );
}
