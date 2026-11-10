"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Teilen ohne Tracking: nutzt die native Teilen-Funktion des Geräts
 * oder kopiert den Link. Es werden keine Social-Media-Skripte geladen.
 */
export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const url = () => `${window.location.origin}${path}`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: url() });
        return;
      } catch {
        // Abbruch durch Nutzer – auf Kopieren zurückfallen ist nicht nötig
        return;
      }
    }
    await copy();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(true);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" size="sm" onClick={share}>
        <Share2 className="size-4" aria-hidden="true" /> Teilen
      </Button>
      <Button variant="secondary" size="sm" onClick={copy}>
        {copied ? <Check className="size-4 text-teal" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
        {copied ? "Link kopiert" : "Link kopieren"}
      </Button>
      <span role="status" className="text-xs text-danger">
        {error ? "Kopieren nicht möglich – bitte Adresse manuell kopieren." : ""}
      </span>
    </div>
  );
}
