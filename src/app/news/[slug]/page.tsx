import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { StatusBadge } from "@/components/ui/badge";
import { ContentBlocks } from "@/components/articles/content-blocks";
import { ShareButtons } from "@/components/articles/share-buttons";
import { JsonLd } from "@/components/seo/json-ld";
import { getNewsItem, news } from "@/lib/content";
import { formatDate } from "@/lib/utils/format";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getNewsItem((await params).slug);
  if (!item) return { title: "News nicht gefunden" };
  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/news/${item.slug}` },
    openGraph: { type: "article", title: item.title, description: item.excerpt, publishedTime: item.publishedAt },
  };
}

export default async function NewsItemPage({ params }: Props) {
  const item = getNewsItem((await params).slug);
  if (!item) notFound();
  return (
    <Container className="max-w-3xl py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: item.title,
          description: item.excerpt,
          datePublished: item.publishedAt,
          inLanguage: "de-DE",
          publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
          mainEntityOfPage: absoluteUrl(`/news/${item.slug}`),
        }}
      />
      <Breadcrumbs items={[{ href: "/news", label: "News" }, { label: item.title }]} />
      <div className="mb-4 flex items-center gap-3 text-sm">
        <time dateTime={item.publishedAt} className="text-teal">
          {formatDate(item.publishedAt)}
        </time>
        <StatusBadge status={item.status} />
      </div>
      <h1 className="text-3xl font-bold sm:text-5xl">{item.title}</h1>
      <p className="mt-4 text-lg text-muted">{item.excerpt}</p>
      <div className="mt-8">
        <ContentBlocks blocks={item.blocks} />
      </div>
      <div className="mt-8">
        <ShareButtons title={item.title} path={`/news/${item.slug}`} />
      </div>
    </Container>
  );
}
