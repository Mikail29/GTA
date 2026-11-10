"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Kleiner Button für Verwaltungsaktionen; die Berechtigung prüft immer der Server. */
export function ActionButton({ action, children, tone = "default", confirm }: { action: () => Promise<{ ok: boolean; message: string }>; children: React.ReactNode; tone?: "default" | "danger" | "success"; confirm?: string }) {
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; message: string } | null>(null);
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm && !window.confirm(confirm)) return;
          startTransition(async () => setMsg(await action()));
        }}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition disabled:opacity-50",
          tone === "danger" && "border-danger/40 text-danger hover:bg-danger/10",
          tone === "success" && "border-success/40 text-success hover:bg-success/10",
          tone === "default" && "border-line text-muted hover:text-white",
        )}
      >
        {pending && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
        {children}
      </button>
      {msg && !msg.ok && (
        <span role="alert" className="text-xs text-danger">
          {msg.message}
        </span>
      )}
    </span>
  );
}
