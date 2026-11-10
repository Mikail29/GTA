import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge, SpoilerBadge, StatusBadge } from "@/components/ui/badge";
import { CoverArt } from "@/components/ui/cover-art";
import { findCategory, secretCategories } from "@/data/categories";
import type { Secret } from "@/types/content";

export function SecretCard({ secret }: { secret: Secret }) {
  const category = findCategory(secretCategories, secret.category);
  return (
    <article className="surface group relative flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-violet/50">
      <CoverArt accent={category?.accent ?? "violet"} icon={category?.icon ?? "eye"} className="aspect-[2/1]" label="Bildplatzhalter" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          {category && <Badge accent={category.accent}>{category.name}</Badge>}
          <StatusBadge status={secret.status} />
          {secret.spoiler && <SpoilerBadge />}
        </div>
        <h3 className="text-lg font-bold">
          <Link href={`/geheimnisse/${secret.slug}`} className="after:absolute after:inset-0 group-hover:text-[#b89bff]">
            {secret.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{secret.excerpt}</p>
        <p className="mt-auto inline-flex items-center gap-1.5 pt-1 text-xs text-muted">
          <MapPin className="size-3.5" aria-hidden="true" />
          {secret.location ?? "Fundort noch unbekannt"}
        </p>
      </div>
    </article>
  );
}
