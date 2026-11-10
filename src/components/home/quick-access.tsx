import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";
import type { Accent, IconName } from "@/types/content";

const tiles: { href: string; title: string; text: string; icon: IconName; accent: Accent }[] = [
  { href: "/tipps", title: "Tipps & Tricks", text: "Ratgeber für Einsteiger und Profis – klar gekennzeichnet nach Verlässlichkeit.", icon: "lightbulb", accent: "pink" },
  { href: "/karte", title: "Interaktive Karte", text: "Fundorte, Sammelobjekte und Missionen auf einen Blick (in Vorbereitung).", icon: "map", accent: "teal" },
  { href: "/missionen", title: "Missionen", text: "Komplettlösungen Schritt für Schritt – mit Spoiler-Warnung.", icon: "target", accent: "sunset" },
  { href: "/geheimnisse", title: "Geheimnisse", text: "Easter Eggs, versteckte Orte und seltene Fahrzeuge.", icon: "key", accent: "violet" },
  { href: "/community", title: "Community", text: "Fragen stellen, Antworten geben und gemeinsam rätseln.", icon: "users", accent: "teal" },
  { href: "/community#starter", title: "GTA 6 Starter", text: "Neu dabei? Stell dich vor und stelle deine ersten Fragen.", icon: "rocket", accent: "pink" },
];

const accentStyles: Record<Accent, { icon: string; hover: string }> = {
  pink: { icon: "bg-pink/12 text-pink", hover: "hover:border-pink/50 hover:shadow-glow-pink" },
  teal: { icon: "bg-teal/12 text-teal", hover: "hover:border-teal/50 hover:shadow-glow-teal" },
  violet: { icon: "bg-violet/15 text-[#b89bff]", hover: "hover:border-violet/60" },
  sunset: { icon: "bg-sunset/12 text-sunset", hover: "hover:border-sunset/50" },
};

export function QuickAccess() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map((t) => (
        <li key={t.href}>
          <Link href={t.href} className={cn("surface group flex h-full gap-4 p-5 transition duration-300 hover:-translate-y-1", accentStyles[t.accent].hover)}>
            <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", accentStyles[t.accent].icon)}>
              <Icon name={t.icon} className="size-6" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 text-lg font-bold">
                {t.title}
                <ArrowUpRight className="size-4 text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
              </span>
              <span className="mt-1 block text-sm text-muted">{t.text}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
