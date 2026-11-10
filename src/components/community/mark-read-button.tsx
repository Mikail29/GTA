"use client";

import { useTransition } from "react";
import { CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markNotificationsReadAction } from "@/lib/community/actions";

export function MarkReadButton() {
  const [pending, startTransition] = useTransition();
  return (
    <Button variant="secondary" size="sm" disabled={pending} onClick={() => startTransition(async () => void (await markNotificationsReadAction()))}>
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <CheckCheck className="size-4" aria-hidden="true" />} Alle als gelesen markieren
    </Button>
  );
}
