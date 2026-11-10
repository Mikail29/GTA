import { BadgeCheck, CircleDashed, FlaskConical, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Accent, VerificationStatus } from "@/types/content";

const accents: Record<Accent | "neutral", string> = {
  pink: "border-pink/30 bg-pink/10 text-pink",
  teal: "border-teal/30 bg-teal/10 text-teal",
  violet: "border-violet/30 bg-violet/10 text-[#b89bff]",
  sunset: "border-sunset/30 bg-sunset/10 text-sunset",
  neutral: "border-line bg-white/5 text-muted",
};

export function Badge({ accent = "neutral", className, children }: { accent?: Accent | "neutral"; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", accents[accent], className)}>
      {children}
    </span>
  );
}

const statusMeta: Record<VerificationStatus, { label: string; accent: Accent | "neutral"; Icon: typeof BadgeCheck; hint: string }> = {
  verifiziert: { label: "Verifiziert", accent: "teal", Icon: BadgeCheck, hint: "Durch offizielle Quelle oder eigene Prüfung bestätigt" },
  unbestaetigt: { label: "Unbestätigt", accent: "sunset", Icon: CircleDashed, hint: "Noch nicht abschließend geprüft" },
  demo: { label: "Demo-Inhalt", accent: "violet", Icon: FlaskConical, hint: "Beispielinhalt ohne echte Spielinformation" },
};

export function StatusBadge({ status, className }: { status: VerificationStatus; className?: string }) {
  const meta = statusMeta[status];
  return (
    <Badge accent={meta.accent} className={className}>
      <meta.Icon className="size-3.5" aria-hidden="true" />
      <span title={meta.hint}>{meta.label}</span>
    </Badge>
  );
}

export function SpoilerBadge() {
  return (
    <Badge accent="pink">
      <TriangleAlert className="size-3.5" aria-hidden="true" />
      Spoiler
    </Badge>
  );
}
