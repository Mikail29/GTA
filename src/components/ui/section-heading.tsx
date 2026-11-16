import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  text,
  href,
  linkLabel,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  href?: string;
  linkLabel?: string;
  /** Kleinere Überschrift mit weniger Abstand (z. B. für kurze Listen). */
  compact?: boolean;
}) {
  return (
    <div className={compact ? "mb-4 flex items-end justify-between gap-4" : "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"}>
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal">{eyebrow}</p>}
        <h2 className={compact ? "text-xl font-bold" : "text-2xl font-bold sm:text-3xl"}>{title}</h2>
        {text && <p className="mt-2 text-muted">{text}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-white">
          {linkLabel ?? "Alle ansehen"}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
