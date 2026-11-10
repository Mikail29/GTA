import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";
import { CoverArt } from "@/components/ui/cover-art";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { articleCategories, findCategory } from "@/data/categories";
import { formatDate, readingMinutes } from "@/lib/utils/format";
import type { Article } from "@/types/content";

export function ArticleCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  const category = findCategory(articleCategories, article.category);
  return (
    <article className="surface group relative flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-pink/40 hover:shadow-glow-pink">
      <CoverArt accent={category?.accent ?? "violet"} icon={category?.icon ?? "lightbulb"} className="aspect-[16/9]" label={`Vorschaugrafik: ${category?.name ?? "Ratgeber"}`} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {category && <Badge accent={category.accent}>{category.name}</Badge>}
          <StatusBadge status={article.status} />
        </div>
        <h3 className={priority ? "text-xl font-bold" : "text-lg font-bold"}>
          <Link href={`/tipps/${article.slug}`} className="after:absolute after:inset-0 group-hover:text-pink">
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-muted">{article.excerpt}</p>
        <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {readingMinutes(article.blocks)} Min. Lesezeit
          </span>
        </div>
      </div>
    </article>
  );
}
