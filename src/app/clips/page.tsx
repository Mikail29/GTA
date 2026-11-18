import type { Metadata } from "next";
import { Camera, CirclePlay, Clapperboard, Clock, ExternalLink, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";
import { clipChannels, type ClipPlatform } from "@/data/clips";

export const metadata: Metadata = {
  title: "GTA 6 Clips",
  description: "GTA 6 Clips vom 5-Sterne-Kompass auf YouTube, Instagram und TikTok.",
  alternates: { canonical: "/clips" },
};

const style: Record<ClipPlatform, { Icon: typeof CirclePlay; box: string }> = {
  youtube: { Icon: CirclePlay, box: "bg-pink/12 text-pink" },
  instagram: { Icon: Camera, box: "bg-violet/15 text-[#b89bff]" },
  tiktok: { Icon: Clapperboard, box: "bg-teal/12 text-teal" },
};

export default function ClipsPage() {
  return (
    <>
      <PageHeader eyebrow="Videos" title="GTA 6 Clips" text="Die besten Momente aus GTA 6 – auf YouTube, Instagram und TikTok." crumbs={[{ label: "GTA 6 Clips" }]} />
      <Container className="grid gap-8 py-10">
        <ul className="grid gap-4 md:grid-cols-3">
          {clipChannels.map((c) => {
            const { Icon, box } = style[c.platform];
            return (
              <li key={c.platform} className="surface flex flex-col gap-4 p-6">
                <span className={cn("grid size-14 place-items-center rounded-2xl", box)}>
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{c.name}</h2>
                  <p className="mt-1 text-sm text-muted">{c.text}</p>
                </div>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink to-violet px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Zum {c.name}-Kanal <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-muted">
                    <Clock className="size-4" aria-hidden="true" /> Link folgt in Kürze
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <p className="flex items-start gap-2 text-xs text-muted">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Die Links führen zu YouTube, Instagram und TikTok. Erst wenn du einen Link anklickst, verlässt du den 5-Sterne-Kompass; dort gelten die Datenschutzhinweise der jeweiligen Plattform.
        </p>
      </Container>
    </>
  );
}
