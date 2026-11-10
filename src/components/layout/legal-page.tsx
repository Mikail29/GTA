import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";

export function LegalPage({ title, text, crumb, review = true, children }: { title: string; text?: string; crumb: string; review?: boolean; children: React.ReactNode }) {
  return (
    <>
      <PageHeader title={title} text={text} crumbs={[{ label: crumb }]} />
      <Container className="max-w-3xl py-10">
        {review && (
          <Notice tone="warning" title="Rechtlich zu prüfen" className="mb-8">
            Diese Seite ist eine Vorlage mit Platzhaltern. Sie ersetzt keine Rechtsberatung und muss vor der Veröffentlichung vom Betreiber vervollständigt und geprüft werden.
          </Notice>
        )}
        <div className="prose-kompass">{children}</div>
      </Container>
    </>
  );
}

/** Deutlich markierter Platzhalter für noch fehlende Angaben. */
export function Placeholder({ children }: { children: React.ReactNode }) {
  return <mark className="rounded bg-sunset/20 px-1.5 py-0.5 font-medium text-sunset">[{children}]</mark>;
}
