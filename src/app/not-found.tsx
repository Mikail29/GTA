import { Compass, Home, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <Compass className="size-16 animate-pulse-soft text-pink" aria-hidden="true" />
      <p className="mt-6 font-display text-7xl font-bold text-gradient">404</p>
      <h1 className="mt-2 text-2xl font-bold">Hier geht&apos;s nicht weiter.</h1>
      <p className="mt-2 max-w-md text-muted">Die Seite existiert nicht oder wurde verschoben. Dein Kompass bringt dich zurück auf Kurs.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/">
          <Home className="size-4" aria-hidden="true" /> Zur Startseite
        </LinkButton>
        <LinkButton href="/suche" variant="secondary">
          <Search className="size-4" aria-hidden="true" /> Suche
        </LinkButton>
      </div>
    </Container>
  );
}
