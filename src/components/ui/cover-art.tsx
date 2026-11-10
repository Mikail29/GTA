import { Icon } from "./icon";
import { cn } from "@/lib/utils/cn";
import type { Accent, IconName } from "@/types/content";

const gradients: Record<Accent, string> = {
  pink: "from-[#3a1240] via-[#5a1a5c] to-[#ff55b8]/70",
  teal: "from-[#0f2a3a] via-[#123f4d] to-[#42e8d5]/60",
  violet: "from-[#1d1540] via-[#2f1f66] to-[#9565ff]/70",
  sunset: "from-[#3a1a2a] via-[#6a2a3a] to-[#ff9b68]/70",
};

/**
 * Selbst erstelltes Platzhalter-Vorschaubild (reines CSS/SVG):
 * Retro-Sonne, Horizont-Raster und Palmen-Silhouette – keine fremden Bildrechte.
 */
export function CoverArt({ accent, icon, className, label }: { accent: Accent; icon: IconName; className?: string; label?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br", gradients[accent], className)} role="img" aria-label={label ?? "Platzhalter-Grafik"}>
      <div className="absolute left-1/2 top-[38%] size-28 -translate-x-1/2 rounded-full bg-gradient-to-b from-sunset to-pink opacity-80 [mask-image:repeating-linear-gradient(to_bottom,black_0_9px,transparent_9px_12px)]" />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-night/50 [background-image:linear-gradient(rgb(66_232_213/0.25)_1px,transparent_1px),linear-gradient(90deg,rgb(66_232_213/0.25)_1px,transparent_1px)] [background-size:28px_18px] [transform:perspective(220px)_rotateX(55deg)] origin-bottom" />
      <svg viewBox="0 0 120 80" className="absolute bottom-0 right-3 h-3/4 text-night/80" fill="currentColor" aria-hidden="true">
        <path d="M70 80 C72 60 74 45 80 30 L82 31 C77 45 75 60 74 80 Z" />
        <path d="M81 30 C70 22 58 24 50 30 C60 26 70 27 80 32 Z M81 30 C88 20 100 18 110 22 C100 22 90 25 82 32 Z M81 30 C78 18 70 10 60 8 C70 13 76 20 80 31 Z M81 30 C90 26 102 30 108 38 C99 32 90 31 82 32 Z M81 30 C70 32 62 40 58 48 C65 40 72 35 81 32 Z" />
      </svg>
      <span className="absolute left-4 top-4 grid size-10 place-items-center rounded-xl bg-night/60 text-white backdrop-blur">
        <Icon name={icon} className="size-5" />
      </span>
    </div>
  );
}
