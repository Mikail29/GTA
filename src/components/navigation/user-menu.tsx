"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { Avatar } from "@/components/community/avatar";
import { signOutAction } from "@/lib/auth/actions";
import type { UserRole } from "@/types/community";

export function UserMenu({ user }: { user: { username: string; avatarUrl: string | null; role: UserRole } }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-line bg-card py-1 pl-1 pr-3 text-sm transition hover:border-pink/50"
      >
        <Avatar name={user.username} url={user.avatarUrl} size={30} />
        <span className="max-w-[8rem] truncate font-medium">{user.username}</span>
        <ChevronDown className="size-4 text-muted" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="surface absolute right-0 mt-2 w-56 overflow-hidden p-1.5">
          <Link role="menuitem" href="/profil" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5" onClick={() => setOpen(false)}>
            <UserRound className="size-4" aria-hidden="true" /> Mein Profil
          </Link>
          {(user.role === "admin" || user.role === "moderator") && (
            <Link role="menuitem" href="/admin" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5" onClick={() => setOpen(false)}>
              <LayoutDashboard className="size-4" aria-hidden="true" /> Verwaltung
            </Link>
          )}
          <form action={signOutAction}>
            <button role="menuitem" type="submit" className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-danger hover:bg-danger/10">
              <LogOut className="size-4" aria-hidden="true" /> Abmelden
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
