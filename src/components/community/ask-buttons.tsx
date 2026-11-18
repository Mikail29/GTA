import { Megaphone, MessageSquarePlus } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/** Die zwei Einstiege in die Community: eine Frage stellen oder etwas mitteilen. */
export function AskButtons({ className, center = false }: { className?: string; center?: boolean }) {
  return (
    <div className={cn("flex flex-wrap gap-3", center && "justify-center", className)}>
      <LinkButton href="/fragen/neu">
        <MessageSquarePlus className="size-4" aria-hidden="true" /> Ich habe eine Frage…
      </LinkButton>
      <LinkButton href="/fragen/neu?art=mitteilung" variant="secondary">
        <Megaphone className="size-4" aria-hidden="true" /> Ich möchte etwas mitteilen…
      </LinkButton>
    </div>
  );
}
