"use client";

import { useState, useTransition } from "react";
import { EyeOff, Loader2 } from "lucide-react";
import { inputClass } from "@/components/forms/field";
import { setHiddenAction } from "@/lib/admin/actions";
import { moderationReasons } from "@/lib/validations/community";

/**
 * Inhalt ausblenden MIT Begründung. Die betroffene Person wird automatisch
 * benachrichtigt (Pflicht nach Art. 17 Digital Services Act).
 */
export function HideButton({ table, id, defaultReason }: { table: "questions" | "answers" | "comments"; id: string; defaultReason?: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>(defaultReason ?? moderationReasons[moderationReasons.length - 1]);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; message: string } | null>(null);

  if (msg?.ok) return <span className="text-xs text-success">{msg.message}</span>;
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-danger/40 px-3 text-xs font-medium text-danger transition hover:bg-danger/10">
        <EyeOff className="size-3.5" aria-hidden="true" /> Ausblenden
      </button>
    );
  }
  return (
    <span className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-danger/30 bg-danger/5 p-2">
      <label className="sr-only" htmlFor={`reason-${id}`}>
        Begründung
      </label>
      <select id={`reason-${id}`} value={reason} onChange={(e) => setReason(e.target.value)} className={`${inputClass} h-9 max-w-xs py-1`}>
        {moderationReasons.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(async () => setMsg(await setHiddenAction(table, id, true, reason)))}
        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-danger px-3 text-xs font-semibold text-night disabled:opacity-50"
      >
        {pending && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />} Ausblenden & benachrichtigen
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs text-muted hover:text-white">
        Abbrechen
      </button>
      {msg && !msg.ok && (
        <span role="alert" className="text-xs text-danger">
          {msg.message}
        </span>
      )}
    </span>
  );
}
