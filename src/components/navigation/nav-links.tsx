"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils/cn";

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Hauptnavigation" className={className}>
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition 2xl:px-3",
                  active ? "text-white" : "text-muted hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
                {item.soon && <span className="ml-1.5 rounded-full bg-sunset/15 px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-sunset">Bald</span>}
                {active && <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-gradient-to-r from-pink to-violet" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
