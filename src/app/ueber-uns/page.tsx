import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Über GTA6-Kompass", description: "Wer wir sind und wie GTA6-Kompass arbeitet.", alternates: { canonical: "/ueber-uns" } };

export default function UeberUnsPage() {
  return (
    <LegalPage title="Über GTA6-Kompass" text={siteConfig.claim} crumb="Über uns" review={false}>
      <p>
        GTA6-Kompass ist ein unabhängiges, deutschsprachiges und kostenloses Fan- und Hilfeportal rund um Grand Theft Auto VI. Unser Ziel: eine zentrale, verlässliche Anlaufstelle für Tipps, Komplettlösungen,
        Geheimnisse und Austausch – ohne Clickbait und ohne Gerüchte als Fakten zu verkaufen.
      </p>
      <h2 id="prinzipien">Unsere Prinzipien</h2>
      <ul>
        <li>
          <strong>Transparenz:</strong> Jeder Inhalt trägt einen Status – verifiziert, unbestätigt oder Demo. Mehr dazu im{" "}
          <Link href="/tipps/gameplay-wie-wir-informationen-pruefen">Ratgeber zur Prüfung</Link>.
        </li>
        <li>
          <strong>Datenschutz:</strong> Kein Tracking, keine Werbe-Cookies.
        </li>
        <li>
          <strong>Eigene Inhalte:</strong> Wir verwenden keine geschützten Logos, Screenshots oder Karten ohne Nutzungsrechte. Alle Grafiken sind selbst erstellt.
        </li>
      </ul>
      <h2 id="unabhaengig">Unabhängigkeit</h2>
      <p>{siteConfig.disclaimer}</p>
      <h2 id="mitmachen">Mitmachen</h2>
      <p>
        Werde Teil der <Link href="/community">Community</Link> oder schreib uns über die <Link href="/kontakt">Kontaktseite</Link>.
      </p>
    </LegalPage>
  );
}
