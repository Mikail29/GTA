import type { Metadata } from "next";
import { LegalPage, Placeholder } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Impressum", alternates: { canonical: "/impressum" } };

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum" crumb="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        <Placeholder>Vor- und Nachname bzw. Name des Betreibers</Placeholder>
        <br />
        <Placeholder>Straße und Hausnummer</Placeholder>
        <br />
        <Placeholder>PLZ und Ort</Placeholder>
      </p>
      <h2>Kontakt</h2>
      <p>
        E-Mail: {siteConfig.contactEmail ? siteConfig.contactEmail : <Placeholder>E-Mail-Adresse</Placeholder>}
        <br />
        Telefon (optional): <Placeholder>Telefonnummer</Placeholder>
      </p>
      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        <Placeholder>Name und Anschrift der verantwortlichen Person</Placeholder>
      </p>
      <h2>Hinweis zum Fanprojekt</h2>
      <p>{siteConfig.disclaimer}</p>
      <h2>Haftung für Inhalte und Links</h2>
      <p>
        <Placeholder>Haftungshinweise – vom Betreiber zu formulieren bzw. rechtlich prüfen zu lassen</Placeholder>
      </p>
      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        <Placeholder>Angabe zur Teilnahme an Streitbeilegungsverfahren – rechtlich prüfen</Placeholder>
      </p>
    </LegalPage>
  );
}
