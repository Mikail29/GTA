"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button, LinkButton } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <TriangleAlert className="size-14 text-sunset" aria-hidden="true" />
      <h1 className="mt-6 text-2xl font-bold">Da ist etwas schiefgelaufen.</h1>
      <p className="mt-2 max-w-md text-muted">Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut. {error.digest && <span className="block text-xs">Fehler-ID: {error.digest}</span>}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" /> Erneut versuchen
        </Button>
        <LinkButton href="/" variant="secondary">
          Zur Startseite
        </LinkButton>
      </div>
    </Container>
  );
}
