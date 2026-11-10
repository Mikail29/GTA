import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * Eigenes Grafiklogo: Kompassnadel im Sunset-Verlauf, darüber ein Bogen aus
 * fünf Sternen (Anspielung auf die höchste Fahndungsstufe).
 */
export function LogoMark({ className }: { className?: string }) {
  // Fünf Sterne auf einem Bogen über der Nadel
  const stars = [
    [8, 13.5],
    [13.5, 9],
    [20, 7.2],
    [26.5, 9],
    [32, 13.5],
  ];
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
      {stars.map(([x, y], i) => (
        <path
          key={i}
          transform={`translate(${x} ${y}) scale(0.5)`}
          d="M0 -6 L1.76 -2.43 L5.7 -1.85 L2.85 0.93 L3.53 4.85 L0 3 L-3.53 4.85 L-2.85 0.93 L-5.7 -1.85 L-1.76 -2.43 Z"
          fill="#42E8D5"
        />
      ))}
      <path d="M20 15 L23.2 24.5 L20 34 L16.8 24.5 Z" fill="url(#logo-g)" />
      <path d="M20 24.5 L23.2 24.5 L20 34 Z" fill="#100F20" fillOpacity="0.35" />
      <circle cx="20" cy="24.5" r="1.6" fill="#fff" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label="5-Sterne-Kompass – zur Startseite">
      <LogoMark className="transition-transform duration-300 group-hover:rotate-6" />
      <span className="whitespace-nowrap font-display text-lg font-bold leading-none tracking-tight">
        5-Sterne<span className="text-gradient">-Kompass</span>
      </span>
    </Link>
  );
}
