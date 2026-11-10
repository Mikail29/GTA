"use client";

import { useState, useTransition } from "react";
import { Loader2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage, inputClass } from "@/components/forms/field";
import { deleteAccountAction } from "@/lib/auth/actions";

/** Konto selbst löschen – mit Sicherheitsabfrage durch Eintippen eines Bestätigungstextes. */
export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="danger" onClick={() => setOpen(true)}>
        <UserX className="size-4" aria-hidden="true" /> Konto löschen
      </Button>
    );
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await deleteAccountAction(confirmation);
          if (res) setResult(res);
        });
      }}
    >
      <div className="text-sm text-muted">
        <p className="mb-2 font-semibold text-white">Das passiert beim Löschen:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Dein Konto, dein Profil und dein Profilbild werden gelöscht.</li>
          <li>Deine Antworten, Kommentare und Likes werden gelöscht.</li>
          <li>Deine Fragen ohne Antworten werden gelöscht.</li>
          <li>Fragen, auf die andere schon geantwortet haben, bleiben ohne deinen Namen erhalten („Gelöschtes Konto“), damit fremde Antworten nicht verloren gehen.</li>
        </ul>
        <p className="mt-2 font-semibold text-danger">Das kann nicht rückgängig gemacht werden.</p>
      </div>
      <label className="grid gap-1.5 text-sm">
        Tippe zur Bestätigung <strong className="text-white">KONTO LÖSCHEN</strong> ein:
        <input value={confirmation} onChange={(e) => setConfirmation(e.target.value)} autoComplete="off" className={inputClass} />
      </label>
      <FormMessage result={result} />
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="danger" disabled={pending || confirmation.trim().toUpperCase() !== "KONTO LÖSCHEN"}>
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <UserX className="size-4" aria-hidden="true" />} Endgültig löschen
        </Button>
        <Button variant="ghost" onClick={() => (setOpen(false), setConfirmation(""))}>
          Abbrechen
        </Button>
      </div>
    </form>
  );
}
