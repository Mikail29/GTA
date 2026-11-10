"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Datenschutz-Hinweis.
 * 5-Sterne-Kompass setzt standardmäßig KEINE Tracking- oder Marketing-Cookies.
 * Es werden nur technisch notwendige Cookies (Anmeldung) verwendet – dafür ist
 * keine Einwilligung nötig, wir informieren aber transparent darüber.
 * Sollten später einwilligungspflichtige Dienste ergänzt werden, muss hier ein
 * echtes Einwilligungsmanagement (Opt-in) umgesetzt werden.
 */
const KEY = "gta6k-privacy-notice-v1";
const listeners = new Set<() => void>();

function read() {
  try {
    return localStorage.getItem(KEY) === "ok";
  } catch {
    return true; // Speicher blockiert → Hinweis nicht ständig erneut zeigen
  }
}

export function PrivacyNotice() {
  const acknowledged = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => true,
  );

  if (acknowledged) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, "ok");
    } catch {}
    listeners.forEach((l) => l());
  };

  return (
    <div role="region" aria-label="Datenschutz-Hinweis" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl sm:bottom-5">
      <div className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <Cookie className="hidden size-6 shrink-0 text-sunset sm:block" aria-hidden="true" />
        <p className="text-sm text-muted">
          Wir verwenden nur technisch notwendige Cookies (z. B. für die Anmeldung) und <strong className="text-white">kein Tracking</strong>. Mehr in der{" "}
          <Link href="/datenschutz" className="text-teal underline underline-offset-2">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <Button size="sm" onClick={close} className="shrink-0">
          Verstanden
        </Button>
      </div>
    </div>
  );
}
