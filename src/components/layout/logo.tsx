import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/** Eigenes Text-/Grafiklogo: stilisierte Kompassnadel im Sunset-Verlauf. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF9B68" />
          <stop offset="50%" stopColor="#FF55B8" />
          <stop offset="100%" stopColor="#9565FF" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#19172E" stroke="url(#logo-g)" strokeWidth="2" />
      <circle cx="20" cy="20" r="11" fill="none" stroke="#42E8D5" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M20 7 L24 20 L20 33 L16 20 Z" fill="url(#logo-g)" />
      <path d="M20 20 L24 20 L20 33 Z" fill="#100F20" fillOpacity="0.35" />
      <circle cx="20" cy="20" r="2" fill="#fff" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label="GTA6-Kompass – zur Startseite">
      <LogoMark className="transition-transform duration-300 group-hover:rotate-12" />
      <span className="font-display text-lg font-bold tracking-tight">
        GTA6<span className="text-gradient">-Kompass</span>
      </span>
    </Link>
  );
}
