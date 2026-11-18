import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Placeholder } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Impressum", alternates: { canonical: "/impressum" } };

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum" crumb="Impressum" review={false}>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        5-Sterne-Kompass
        <br />
        vertreten durch Mikail Koyun und Jamie Can Koyun
        <br />
        Mühlenweg 35
        <br />
        57555 Mudersbach
      </p>

      <h2>Kontakt</h2>
      <p>E-Mail: {siteConfig.contactEmail ? <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> : <Placeholder>E-Mail-Adresse</Placeholder>}</p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        Mikail Koyun und Jamie Can Koyun
        <br />
        Mühlenweg 35, 57555 Mudersbach
      </p>

      <h2>Hinweis zum Fanprojekt</h2>
      <p>{siteConfig.disclaimer}</p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Wir erstellen die Inhalte dieser Website mit Sorgfalt. Für Richtigkeit, Vollständigkeit und Aktualität können wir trotzdem keine Gewähr übernehmen – besonders bei Informationen zu einem neu
        erschienenen Spiel. Deshalb zeigt jeder Beitrag, wie verlässlich er ist (verifiziert, unbestätigt oder Demo).
      </p>
      <p>
        Beiträge in der Community stammen von den jeweiligen Nutzerinnen und Nutzern und geben nicht unsere Meinung wieder. Wir prüfen sie nicht vorab. Sobald wir von rechtswidrigen Inhalten erfahren,
        entfernen wir sie umgehend. Hinweise kannst du jederzeit über die <Link href="/melden">Meldefunktion</Link> geben.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Diese Website enthält Links zu Seiten anderer Anbieter, zum Beispiel zu offiziellen Quellen von Rockstar Games. Auf deren Inhalte haben wir keinen Einfluss; dafür ist der jeweilige Anbieter
        verantwortlich. Beim Setzen der Links waren keine Rechtsverstöße erkennbar. Erfahren wir von Rechtsverletzungen, entfernen wir den Link.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Texte und Grafiken dieser Website haben wir selbst erstellt; sie dürfen nicht ohne unsere Erlaubnis übernommen werden. Bilder, Logos, Karten oder Symbole aus dem Spiel verwenden wir nicht.
        Grand Theft Auto, GTA und Rockstar Games sind Marken ihrer jeweiligen Inhaber.
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
    </LegalPage>
  );
}
