import Link from "next/link";
import { Gauge, Timer } from "lucide-react";
import { Badge, SpoilerBadge, StatusBadge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { findCategory, missionCategories } from "@/data/categories";
import type { Mission } from "@/types/content";

const difficultyLabel = { leicht: "Leicht", mittel: "Mittel", schwer: "Schwer" } as const;

export function MissionCard({ mission }: { mission: Mission }) {
  const category = findCategory(missionCategories, mission.category);
  return (
    <article className="surface group relative flex flex-col gap-4 p-5 transition duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-glow-teal">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-teal/10 text-teal">
          <Icon name={category?.icon ?? "target"} className="size-5" />
        </span>
        <div className="flex flex-wrap justify-end gap-2">
          {mission.spoiler !== "keine" && <SpoilerBadge />}
          <StatusBadge status={mission.status} />
        </div>
      </div>
      <div>
        {category && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">{category.name}</p>}
        <h3 className="text-lg font-bold">
          <Link href={`/missionen/${mission.slug}`} className="after:absolute after:inset-0 group-hover:text-teal">
            {mission.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{mission.excerpt}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2 text-xs">
        <Badge>
          <Gauge className="size-3.5" aria-hidden="true" /> {difficultyLabel[mission.difficulty]}
        </Badge>
        {mission.estimatedMinutes && (
          <Badge>
            <Timer className="size-3.5" aria-hidden="true" /> ca. {mission.estimatedMinutes} Min.
          </Badge>
        )}
        <Badge>{mission.steps.length} Schritte</Badge>
      </div>
    </article>
  );
}
