"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flag, LayoutDashboard, MessagesSquare, Newspaper, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/meldungen", label: "Meldungen", Icon: Flag },
  { href: "/admin/beitraege", label: "Beiträge", Icon: MessagesSquare },
  { href: "/admin/nutzer", label: "Nutzer", Icon: Users },
  { href: "/admin/inhalte", label: "Artikel & Kategorien", Icon: Newspaper },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Verwaltung" className="scrollbar-none -mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
      <ul className="flex gap-2 lg:flex-col">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition", active ? "bg-pink/15 text-white" : "text-muted hover:bg-white/5 hover:text-white")}
              >
                <Icon className="size-4" aria-hidden="true" /> {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
