import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, UserRound } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { CoverArt } from "@/components/ui/cover-art";
import { ContentBlocks, tocFromBlocks } from "@/components/articles/content-blocks";
import { TableOfContents } from "@/components/articles/table-of-contents";
import { ShareButtons } from "@/components/articles/share-buttons";
import { Rating } from "@/components/articles/rating";
import { ArticleCard } from "@/components/cards/article-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { articleCategories, findCategory } from "@/data/categories";
import { articles, getArticle, getRelatedArticles } from "@/lib/content";
import { formatDate, readingMinutes } from "@/lib/utils/format";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return { title: "Ratgeber nicht gefunden" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/tipps/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.excerpt, publishedTime: article.publishedAt, url: `/tipps/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const category = findCategory(articleCategories, article.category);
  const toc = tocFromBlocks(article.blocks);
  const related = getRelatedArticles(article);

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt ?? article.publishedAt,
          inLanguage: "de-DE",
          author: { "@type": "Organization", name: article.author },
          publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
          mainEntityOfPage: absoluteUrl(`/tipps/${article.slug}`),
        }}
      />
      <header className="relative overflow-hidden border-b border-line/60">
        <CoverArt accent={category?.accent ?? "violet"} icon={category?.icon ?? "lightbulb"} className="absolute inset-0 opacity-35" label="Dekorative Platzhalter-Grafik" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/40" />
        <Container className="relative py-12 sm:py-16">
          <Breadcrumbs items={[{ href: "/tipps", label: "Tipps & Tricks" }, ...(category ? [{ href: `/tipps?kategorie=${category.slug}`, label: category.name }] : []), { label: article.title }]} />
          <div className="mb-4 flex flex-wrap gap-2">
            {category && <Badge accent={category.accent}>{category.name}</Badge>}
            <StatusBadge status={article.status} />
          </div>
          <h1 className="max-w-4xl text-3xl font-bold sm:text-5xl">{article.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="size-4" aria-hidden="true" /> {article.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" /> <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" /> {readingMinutes(article.blocks)} Min. Lesezeit
            </span>
          </div>
        </Container>
      </header>

      <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <div className="lg:hidden">
            <TableOfContents items={toc} />
          </div>
          <div className="mt-6 lg:mt-0">
            <ContentBlocks blocks={article.blocks} />
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((t) => (
              <Badge key={t}>#{t}</Badge>
            ))}
          </div>
          <div className="mt-8 grid gap-4">
            <Rating id={`artikel:${article.slug}`} />
            <ShareButtons title={article.title} path={`/tipps/${article.slug}`} />
          </div>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 grid gap-4">
            <TableOfContents items={toc} />
          </div>
        </aside>
      </Container>

      {related.length > 0 && (
        <Container className="pb-6">
          <SectionHeading title="Verwandte Ratgeber" href="/tipps" linkLabel="Alle Ratgeber" />
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </Container>
      )}
    </article>
  );
}
