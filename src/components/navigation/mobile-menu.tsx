"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Car,
  CircleHelp,
  CirclePlay,
  Crosshair,
  Globe,
  House,
  KeyRound,
  LayoutDashboard,
  LogIn,
  LogOut,
  Map as MapIcon,
  Megaphone,
  Menu,
  MessageSquarePlus,
  MessagesSquare,
  Newspaper,
  Search,
  Shapes,
  Target,
  UserPlus,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/community/avatar";
import { buttonClasses } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";
import type { UserRole } from "@/types/community";

type MenuLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
};

/** Alle Seiten im Handy-/Tablet-Menü, nach Bereichen sortiert. */
const groups: { title: string; links: MenuLink[] }[] = [
  {
    title: "Inhalte",
    links: [
      { href: "/", label: "Startseite", icon: House },
      { href: "/missionen", label: "Missionen", icon: Target },
      { href: "/geheimnisse", label: "Geheimnisse", icon: KeyRound },
      { href: "/karte", label: "Interaktive Karte", icon: MapIcon },
      { href: "/personen", label: "Personen & Kontakte", icon: Users },
      { href: "/symbole", label: "Symbole", icon: Shapes },
      { href: "/fahrzeuge", label: "Fahrzeuge", icon: Car },
      { href: "/waffen", label: "Waffen", icon: Crosshair },
      { href: "/news", label: "News", icon: Newspaper },
      { href: "/clips", label: "GTA 6 Clips", icon: CirclePlay },
      { href: "/online", label: "GTA 6 Online", icon: Globe, soon: true },
    ],
  },
  {
    title: "Community",
    links: [
      {
        href: "/community",
        label: "Community-Übersicht",
        icon: MessagesSquare,
      },
      { href: "/fragen", label: "Alle Fragen", icon: CircleHelp },
      {
        href: "/fragen/neu",
        label: "Ich habe eine Frage…",
        icon: MessageSquarePlus,
      },
      {
        href: "/fragen/neu?art=mitteilung",
        label: "Ich möchte etwas mitteilen…",
        icon: Megaphone,
      },
    ],
  },
];

const moreLinks = [
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/community-regeln", label: "Community-Regeln" },
  { href: "/melden", label: "Inhalt melden" },
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/nutzungsbedingungen", label: "Nutzungsbedingungen" },
];

const allHrefs = [...groups.flatMap((g) => g.links.map((l) => l.href)), ...moreLinks.map((l) => l.href)];

/** Welcher Menüpunkt gehört zur aktuellen Seite? (genauester Treffer gewinnt) */
function findActive(path: string, search: string) {
  if (allHrefs.includes(path + search)) return path + search;
  let best: string | undefined;
  for (const href of allHrefs) {
    if (href.includes("?")) continue;
    const hit = href === path || (href !== "/" && path.startsWith(`${href}/`));
    if (hit && (!best || href.length > best.length)) best = href;
  }
  return best;
}

const rowClass = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-semibold text-white transition hover:bg-white/5 aria-[current=page]:bg-white/5 aria-[current=page]:text-pink";
const iconBoxClass = "grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 text-muted";

type MenuUser = { username: string; avatarUrl: string | null; role: UserRole };

export function MobileMenu({ user, unread = 0 }: { user: MenuUser | null; unread?: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Menü bei Seitenwechsel schließen
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    // Wird das Fenster breit genug für die normale Navigation, Menü schließen
    const wide = window.matchMedia("(min-width: 80rem)");
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    // Seite dahinter festhalten, solange das Menü offen ist
    const html = document.documentElement;
    const before = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      [html.style.overflow, document.body.style.overflow] = before;
    };
  }, [open]);

  const close = () => setOpen(false);

  const panel = () => {
    // Das Menü erscheint nur nach einem Tipp im Browser – window ist hier immer vorhanden.
    const active = findActive(pathname, window.location.search);
    const staff = user?.role === "admin" || user?.role === "moderator";
    return (
      // Wichtig: Das Menü hängt direkt am <body> (Portal). Im Kopfbereich mit Unschärfe-Effekt
      // würde Safari (iPhone/iPad) es sonst auf die Höhe der Kopfzeile zusammendrücken.
      <div
        id="mobile-menu"
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-label="Menü"
        className="fixed inset-x-0 bottom-0 top-[65px] z-50 overflow-y-auto overscroll-contain bg-night/[0.98] outline-none backdrop-blur-xl xl:hidden"
      >
        <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-4 sm:px-6">
          {/* Suche */}
          <form action="/suche" role="search" className="relative" onSubmit={close}>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              name="q"
              type="search"
              required
              maxLength={100}
              placeholder="5-Sterne-Kompass durchsuchen…"
              aria-label="Suchbegriff"
              className="h-12 w-full rounded-2xl border border-line bg-card pl-11 pr-4 text-base outline-none focus:border-teal"
            />
          </form>

          {/* Alle Menüpunkte */}
          <nav aria-label="Alle Seiten" className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-x-8">
            {groups.map((group) => (
              <section key={group.title}>
                <h2 className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-muted">{group.title}</h2>
                <ul className="grid gap-0.5">
                  {group.links.map(({ href, label, icon: LinkIcon, soon }) => (
                    <li key={href}>
                      <Link href={href} onClick={close} aria-current={active === href ? "page" : undefined} className={rowClass}>
                        <span className={iconBoxClass}>
                          <LinkIcon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">{label}</span>
                        {soon && <span className="rounded-full bg-sunset/15 px-2 py-0.5 text-xs font-semibold text-sunset">Bald</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>

          {/* Weitere Seiten */}
          <div className="mt-6 border-t border-line/60 pt-5">
            <h2 className="mb-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-muted">Mehr</h2>
            <ul className="flex flex-wrap gap-2 px-1">
              {moreLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={close}
                    aria-current={active === l.href ? "page" : undefined}
                    className="inline-flex rounded-full border border-line px-3 py-1.5 text-sm text-muted transition hover:border-teal/50 hover:text-white aria-[current=page]:border-pink/50 aria-[current=page]:text-pink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Konto */}
          {user ? (
            <div className="surface mt-6 p-2">
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar name={user.username} url={user.avatarUrl} size={40} />
                <div className="min-w-0">
                  <p className="text-xs text-muted">Angemeldet als</p>
                  <p className="truncate font-semibold">{user.username}</p>
                </div>
              </div>
              <ul className="grid gap-0.5 sm:grid-cols-2">
                <li>
                  <Link href="/profil" onClick={close} aria-current={active === "/profil" ? "page" : undefined} className={rowClass}>
                    <span className={iconBoxClass}>
                      <UserRound className="size-4" aria-hidden="true" />
                    </span>
                    Mein Profil
                  </Link>
                </li>
                <li>
                  <Link href="/benachrichtigungen" onClick={close} className={rowClass}>
                    <span className={iconBoxClass}>
                      <Bell className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">Benachrichtigungen</span>
                    {unread > 0 && <span className="grid min-w-6 place-items-center rounded-full bg-pink px-1.5 text-xs font-bold text-night">{unread > 9 ? "9+" : unread}</span>}
                  </Link>
                </li>
                {staff && (
                  <li>
                    <Link href="/admin" onClick={close} className={rowClass}>
                      <span className={iconBoxClass}>
                        <LayoutDashboard className="size-4" aria-hidden="true" />
                      </span>
                      Verwaltung
                    </Link>
                  </li>
                )}
                <li>
                  <form action={signOutAction}>
                    <button type="submit" className={`${rowClass} w-full text-left text-danger hover:bg-danger/10`}>
                      <span className={iconBoxClass}>
                        <LogOut className="size-4" aria-hidden="true" />
                      </span>
                      Abmelden
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          ) : (
            <div className="surface mt-6 p-4">
              <p className="text-sm text-muted">Mit einem kostenlosen Konto kannst du Fragen stellen, antworten und Likes geben.</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link href="/login" onClick={close} className={buttonClasses("secondary", "md")}>
                  <LogIn className="size-4" aria-hidden="true" /> Login
                </Link>
                <Link href="/registrieren" onClick={close} className={buttonClasses("primary", "md")}>
                  <UserPlus className="size-4" aria-hidden="true" /> Registrieren
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        className="grid size-10 place-items-center rounded-full border border-line bg-card text-white transition hover:border-pink/50"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>
      {open && createPortal(panel(), document.body)}
    </div>
  );
}
