import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/badge";
import { getNews } from "@/lib/content";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "News",
  description: "Neuigkeiten rund um GTA 6 und GTA6-Kompass – geprüft und mit Quellenangabe.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  const items = getNews();
  return (
    <>
      <PageHeader eyebrow="Aktuell" title="News" text="Neuigkeiten zu GTA 6 und zum Portal. Offizielle Angaben verlinken wir immer zur Originalquelle." crumbs={[{ label: "News" }]} />
      <Container className="grid max-w-4xl gap-4 py-10">
        {items.map((n) => (
          <article key={n.slug} className="surface group relative p-6 transition hover:border-teal/40">
            <div className="mb-2 flex flex-wrap items-center gap-3 text-sm">
              <time dateTime={n.publishedAt} className="text-teal">
                {formatDate(n.publishedAt)}
              </time>
              <StatusBadge status={n.status} />
            </div>
            <h2 className="text-xl font-bold">
              <Link href={`/news/${n.slug}`} className="after:absolute after:inset-0 group-hover:text-teal">
                {n.title}
              </Link>
            </h2>
            <p className="mt-2 text-muted">{n.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal">
              Weiterlesen <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </article>
        ))}
      </Container>
    </>
  );
}
