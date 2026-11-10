"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

/** Löschen mit Sicherheitsabfrage. Die Berechtigung prüft die Server Action. */
export function DeleteButton({ action, label = "Löschen", confirmText = "Wirklich löschen? Das kann nicht rückgängig gemacht werden." }: { action: () => Promise<{ ok: boolean; message: string } | void>; label?: string; confirmText?: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(confirmText)) return;
          startTransition(async () => {
            const res = await action();
            if (res && !res.ok) setError(res.message);
          });
        }}
        className="inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-xs text-muted transition hover:text-danger"
      >
        {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <Trash2 className="size-3.5" aria-hidden="true" />} {label}
      </button>
      {error && (
        <span role="alert" className="text-xs text-danger">
          {error}
        </span>
      )}
    </span>
  );
}
