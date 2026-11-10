import Link from "next/link";
import { Search } from "lucide-react";
import { AutoSubmitSelect } from "./auto-submit-select";
import { cn } from "@/lib/utils/cn";

export interface FilterSelect {
  name: string;
  label: string;
  value?: string;
  options: { value: string; label: string }[];
}

/**
 * Such- und Filterleiste für Übersichtsseiten.
 * Funktioniert ohne JavaScript (GET-Formular); mit JS werden Auswahlfelder sofort angewendet.
 */
export function ListingFilters({
  basePath,
  q,
  category,
  categories,
  selects = [],
  placeholder = "Durchsuchen…",
}: {
  basePath: string;
  q?: string;
  category?: string;
  categories: { slug: string; name: string }[];
  selects?: FilterSelect[];
  placeholder?: string;
}) {
  const hrefFor = (cat?: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("kategorie", cat);
    for (const s of selects) if (s.value) params.set(s.name, s.value);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="grid gap-4">
      <form action={basePath} role="search" className="flex flex-col gap-3 md:flex-row">
        {category && <input type="hidden" name="kategorie" value={category} />}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            maxLength={100}
            placeholder={placeholder}
            aria-label="Suchbegriff"
            className="h-12 w-full rounded-2xl border border-line bg-card pl-11 pr-4 text-sm outline-none transition focus:border-teal"
          />
        </div>
        {selects.map((s) => (
          <AutoSubmitSelect key={s.name} {...s} />
        ))}
        <button type="submit" className="h-12 rounded-2xl bg-gradient-to-r from-pink to-violet px-6 text-sm font-semibold text-white transition hover:brightness-110">
          Anwenden
        </button>
      </form>
      <nav aria-label="Kategorien" className="scrollbar-none -mx-4 overflow-x-auto px-4">
        <ul className="flex gap-2">
          {[{ slug: "", name: "Alle" }, ...categories].map((c) => {
            const active = (category ?? "") === c.slug;
            return (
              <li key={c.slug || "alle"}>
                <Link
                  href={hrefFor(c.slug || undefined)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition",
                    active ? "border-pink bg-pink/15 text-white" : "border-line bg-card text-muted hover:border-pink/40 hover:text-white",
                  )}
                >
                  {c.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
