import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";
import type { Accent, IconName } from "@/types/content";

const tiles: { href: string; title: string; text: string; icon: IconName; accent: Accent }[] = [
  { href: "/karte", title: "Interaktive Karte", text: "Fundorte, Sammelobjekte und Missionen auf einen Blick (in Vorbereitung).", icon: "map", accent: "teal" },
  { href: "/community", title: "Community", text: "Fragen stellen, Antworten geben und gemeinsam rätseln.", icon: "users", accent: "pink" },
  { href: "/missionen", title: "Missionen", text: "Komplettlösungen Schritt für Schritt – mit Spoiler-Warnung.", icon: "target", accent: "sunset" },
  { href: "/personen", title: "Personen & Kontakte", text: "Wer dir im Spiel hilft – mit Telefonnummern im Spiel (ab Release).", icon: "users", accent: "violet" },
  { href: "/laeden", title: "Läden", text: "Waffen, Kleidung, Fahrzeuge und mehr – wo du was kaufst (ab Release).", icon: "building", accent: "sunset" },
  { href: "/geheimnisse", title: "Geheimnisse", text: "Easter Eggs, versteckte Orte und seltene Fahrzeuge.", icon: "key", accent: "violet" },
];

const accentStyles: Record<Accent, { icon: string; hover: string }> = {
  pink: { icon: "bg-pink/12 text-pink", hover: "hover:border-pink/50 hover:shadow-glow-pink" },
  teal: { icon: "bg-teal/12 text-teal", hover: "hover:border-teal/50 hover:shadow-glow-teal" },
  violet: { icon: "bg-violet/15 text-[#b89bff]", hover: "hover:border-violet/60" },
  sunset: { icon: "bg-sunset/12 text-sunset", hover: "hover:border-sunset/50" },
};

export function QuickAccess() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map((t) => (
        <li key={t.href}>
          <Link href={t.href} className={cn("surface group flex h-full items-start gap-3 p-4 transition duration-300 hover:-translate-y-0.5", accentStyles[t.accent].hover)}>
            <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", accentStyles[t.accent].icon)}>
              <Icon name={t.icon} className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 font-bold">
                {t.title}
                <ArrowUpRight className="size-4 text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
              </span>
              <span className="mt-0.5 block text-sm leading-snug text-muted">{t.text}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
