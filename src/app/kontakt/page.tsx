import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Notice } from "@/components/ui/notice";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Kontakt", description: "So erreichst du das Team vom 5-Sterne-Kompass.", alternates: { canonical: "/kontakt" } };

export default function KontaktPage() {
  return (
    <>
      <PageHeader title="Kontakt" text="Fragen, Hinweise auf Fehler oder Datenschutz-Anliegen? Schreib uns." crumbs={[{ label: "Kontakt" }]} />
      <Container className="grid max-w-5xl gap-8 py-10 lg:grid-cols-[1fr_300px]">
        <div className="surface p-6">
          {siteConfig.contactEmail ? (
            <ContactForm email={siteConfig.contactEmail} />
          ) : (
            <Notice tone="research" title="Kontaktadresse noch nicht hinterlegt">
              Der Betreiber muss noch eine Kontakt-E-Mail-Adresse festlegen (Umgebungsvariable <code>NEXT_PUBLIC_CONTACT_EMAIL</code>). Bis dahin erreichst du uns über die{" "}
              <Link href="/community" className="text-teal underline">
                Community
              </Link>
              .
            </Notice>
          )}
        </div>
        <aside className="grid content-start gap-4 text-sm">
          <div className="surface p-5">
            <h2 className="font-semibold">Spielfragen?</h2>
            <p className="mt-1 text-muted">
              Für Fragen zum Spiel ist die{" "}
              <Link href="/fragen/neu" className="text-teal underline">
                Community
              </Link>{" "}
              meist schneller.
            </p>
          </div>
          <div className="surface p-5">
            <h2 className="font-semibold">Offizieller Support</h2>
            <p className="mt-1 text-muted">Wir sind nicht Rockstar Games und können bei Kauf-, Konto- oder Technikproblemen mit dem Spiel nicht offiziell helfen.</p>
          </div>
        </aside>
      </Container>
    </>
  );
}
