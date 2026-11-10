import type { Metadata } from "next";
import { CircleCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = { title: "Konto gelöscht", robots: { index: false } };

export default function KontoGeloeschtPage() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <CircleCheck className="size-14 text-success" aria-hidden="true" />
      <h1 className="mt-6 text-3xl font-bold">Dein Konto wurde gelöscht.</h1>
      <p className="mt-3 max-w-md text-muted">Schade, dass du gehst! Deine Daten wurden entfernt. Du kannst jederzeit ein neues Konto erstellen.</p>
      <LinkButton href="/" className="mt-8">
        Zur Startseite
      </LinkButton>
    </Container>
  );
}
