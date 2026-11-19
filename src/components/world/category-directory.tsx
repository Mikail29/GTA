import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { SymbolArt, hasSymbolArt } from "@/components/world/symbol-art";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { Accent, Category, IconName, VerificationStatus } from "@/types/content";

export interface DirectoryEntry {
  slug: string;
  title: string;
  category: string;
  text: string;
  /** Eigenes, vereinfachtes Zeichen (z. B. für Symbole). */
  icon?: IconName;
  /** Eigene Zeichnung im Spiel-Look (Name aus symbol-art.tsx), falls vorhanden. */
  art?: string;
  /** Beschreibung, wie es im Spiel aussieht. */
  looks?: string;
  phone?: string;
  location?: string;
  mapLocationId?: string;
  status: VerificationStatus;
}

const accentIcon: Record<Accent, string> = {
  pink: "bg-pink/12 text-pink",
  teal: "bg-teal/12 text-teal",
  violet: "bg-violet/15 text-[#b89bff]",
  sunset: "bg-sunset/12 text-sunset",
};

/** Kategorien als Karten; darin die Einträge oder ein Leer-Hinweis. */
export function CategoryDirectory({ categories, entries, emptyText }: { categories: Category[]; entries: DirectoryEntry[]; emptyText: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {categories.map((cat) => {
        const items = entries.filter((e) => e.category === cat.slug);
        return (
          <section key={cat.slug} id={cat.slug} className="surface scroll-mt-24 p-5" aria-labelledby={`kat-${cat.slug}`}>
            <div className="flex items-start gap-4">
              <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", accentIcon[cat.accent])}>
                <Icon name={cat.icon} className="size-6" />
              </span>
              <div className="min-w-0">
                <h2 id={`kat-${cat.slug}`} className="text-lg font-bold">
                  {cat.name}
                </h2>
                <p className="text-sm text-muted">{cat.description}</p>
              </div>
            </div>
            {items.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-3 text-sm text-muted">{emptyText}</p>
            ) : (
              <ul className="mt-4 grid gap-3">
                {items.map((e) => (
                  <li key={e.slug} className="rounded-2xl border border-line bg-night-2/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-3">
                        {hasSymbolArt(e.art) ? (
                          <SymbolArt name={e.art} className="h-11 w-[76px]" />
                        ) : (
                          e.icon && (
                            <span className={cn("grid size-8 shrink-0 place-items-center rounded-xl", accentIcon[cat.accent])}>
                              <Icon name={e.icon} className="size-4" />
                            </span>
                          )
                        )}
                        <p className="min-w-0 hyphens-auto font-semibold [overflow-wrap:anywhere]">{e.title}</p>
                      </div>
                      <StatusBadge status={e.status} />
                    </div>
                    {e.looks && (
                      <p className="mt-2 text-sm">
                        <span className="font-semibold">Aussehen im Spiel:</span> <span className="text-muted">{e.looks}</span>
                      </p>
                    )}
                    <p className="mt-1 text-sm text-muted">
                      {e.looks && <span className="font-semibold text-white">Bedeutung: </span>}
                      {e.text}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      {e.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="size-3.5" aria-hidden="true" /> Im Spiel: {e.phone}
                        </span>
                      )}
                      {e.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5" aria-hidden="true" /> {e.location}
                        </span>
                      )}
                      {e.mapLocationId && (
                        <Link href={`/karte?marker=${e.mapLocationId}`} className="text-teal underline">
                          Auf der Karte
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
