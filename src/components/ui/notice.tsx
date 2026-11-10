import { CircleAlert, Info, Search, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Tone = "info" | "warning" | "research" | "error" | "success";

const styles: Record<Tone, { box: string; Icon: typeof Info }> = {
  info: { box: "border-teal/30 bg-teal/[0.06] text-teal", Icon: Info },
  warning: { box: "border-sunset/30 bg-sunset/[0.07] text-sunset", Icon: TriangleAlert },
  research: { box: "border-violet/35 bg-violet/[0.08] text-[#b89bff]", Icon: Search },
  error: { box: "border-danger/40 bg-danger/[0.08] text-danger", Icon: CircleAlert },
  success: { box: "border-success/40 bg-success/[0.08] text-success", Icon: Info },
};

export function Notice({ tone = "info", title, children, className }: { tone?: Tone; title?: string; children: React.ReactNode; className?: string }) {
  const { box, Icon } = styles[tone];
  return (
    <div role={tone === "error" ? "alert" : "note"} className={cn("flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed", box, className)}>
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div className="text-muted">{children}</div>
      </div>
    </div>
  );
}
