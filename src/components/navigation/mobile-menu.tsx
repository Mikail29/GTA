"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Rocket, Search, X } from "lucide-react";
import { mainNav } from "@/lib/site";
import { buttonClasses } from "@/components/ui/button";

export function MobileMenu({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Menü bei Seitenwechsel schließen
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        className="grid size-10 place-items-center rounded-full border border-line bg-card text-white transition hover:border-pink/50"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-night/[0.98] px-4 pb-10 pt-4 backdrop-blur-xl">
          <form action="/suche" role="search" className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input name="q" type="search" placeholder="5-Sterne-Kompass durchsuchen…" aria-label="Suchbegriff" className="h-12 w-full rounded-2xl border border-line bg-card pl-11 pr-4 text-sm outline-none focus:border-teal" />
          </form>
          <nav aria-label="Mobile Navigation">
            <ul className="grid gap-1">
              {[{ href: "/", label: "Startseite" }, ...mainNav, { href: "/fragen", label: "Fragen" }].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="block rounded-xl px-4 py-3 text-lg font-semibold text-white transition hover:bg-white/5 aria-[current=page]:bg-white/5 aria-[current=page]:text-pink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 grid gap-3">
            <Link href="/community#starter" className={buttonClasses("secondary", "lg", "w-full")}>
              <Rocket className="size-5" aria-hidden="true" /> GTA 6 Starter
            </Link>
            {loggedIn ? (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/benachrichtigungen" className={buttonClasses("secondary", "lg")}>
                  Benachrichtigungen
                </Link>
                <Link href="/profil" className={buttonClasses("primary", "lg")}>
                  Mein Profil
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" className={buttonClasses("secondary", "lg")}>
                  Login
                </Link>
                <Link href="/registrieren" className={buttonClasses("primary", "lg")}>
                  Registrieren
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
