"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

/** Kompakte Suche im Header: Symbol klappt ein Eingabefeld auf. */
export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Nach dem Seitenwechsel (z. B. zur Suchseite) wieder einklappen
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement))) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="hidden sm:block">
      {open ? (
        <form action="/suche" role="search" className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            name="q"
            type="search"
            required
            maxLength={100}
            placeholder="Suchen…"
            aria-label="Suchbegriff"
            onBlur={(e) => !e.currentTarget.value && setOpen(false)}
            className="h-10 w-56 rounded-full border border-line bg-card pl-9 pr-9 text-sm outline-none transition focus:border-teal"
          />
          <button type="button" onClick={() => setOpen(false)} aria-label="Suche schließen" className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-white">
            <X className="size-4" aria-hidden="true" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Suche öffnen (Tastenkürzel: /)"
          className="grid size-10 place-items-center rounded-full border border-line bg-card text-muted transition hover:border-teal/50 hover:text-white"
        >
          <Search className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
