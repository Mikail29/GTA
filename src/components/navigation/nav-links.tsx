"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { mainNav, type NavItem } from "@/lib/site";
import { cn } from "@/lib/utils/cn";

const linkClass = (active: boolean) =>
  cn("relative whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition 2xl:px-3", active ? "text-white" : "text-muted hover:bg-white/5 hover:text-white");

const Underline = () => <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-gradient-to-r from-pink to-violet" />;

/** Aufklappmenü für Menüpunkte mit Unterpunkten (z. B. „Spielwelt“). */
function Dropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const active = item.children!.some((c) => pathname === c.href || pathname.startsWith(`${c.href}/`));

  // Bei Seitenwechsel schließen
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="true" className={cn(linkClass(active), "inline-flex items-center gap-1")}>
        {item.label}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
        {active && <Underline />}
      </button>
      {open && (
        <ul className="surface absolute left-0 top-full z-50 mt-2 w-64 p-1.5">
          {item.children!.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                aria-current={pathname === c.href ? "page" : undefined}
                className="block rounded-xl px-3 py-2.5 transition hover:bg-white/5 aria-[current=page]:bg-white/5"
              >
                <span className="block text-sm font-medium text-white">{c.label}</span>
                {c.description && <span className="block text-xs text-muted">{c.description}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Hauptnavigation" className={className}>
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => {
          if (item.children) return <Dropdown key={item.label} item={item} pathname={pathname} />;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={active ? "page" : undefined} className={linkClass(active)}>
                {item.label}
                {item.soon && <span className="ml-1.5 rounded-full bg-sunset/15 px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-sunset">Bald</span>}
                {active && <Underline />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
