import { ExternalLink, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { Accent, Category, VerificationStatus } from "@/types/content";

export interface DirectoryEntry {
  slug: string;
  title: string;
  category: string;
  text: string;
  phone?: string;
  location?: string;
  mapLocationId?: string;
  status: VerificationStatus;
  source?: { label: string; url: string };
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
    <div className="grid gap-6 md:grid-cols-2">
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
                      <p className="font-semibold">{e.title}</p>
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted">{e.text}</p>
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
                      {e.source && (
                        <a href={e.source.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-teal underline">
                          Quelle <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
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
