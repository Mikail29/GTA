import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Placeholder } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen",
  description: "Die Nutzungsbedingungen der GTA6-Kompass-Community: Konto, Inhalte, Moderation, Meldungen und Löschung.",
  alternates: { canonical: "/nutzungsbedingungen" },
};

export default function NutzungsbedingungenPage() {
  return (
    <LegalPage title="Nutzungsbedingungen" text="Die Regeln für die Nutzung von GTA6-Kompass und der Community." crumb="Nutzungsbedingungen">
      <h2 id="geltung">1. Geltungsbereich</h2>
      <p>
        Diese Bedingungen gelten für die Nutzung der Website GTA6-Kompass, insbesondere der Community (Fragen, Antworten, Kommentare, Likes und Meldungen). Anbieter ist{" "}
        <Placeholder>Name und Anschrift wie im Impressum</Placeholder>. {siteConfig.disclaimer}
      </p>

      <h2 id="konto">2. Benutzerkonto und Mindestalter</h2>
      <ul>
        <li>Lesen ist ohne Konto möglich. Zum Schreiben, Liken und für Benachrichtigungen brauchst du ein kostenloses Konto.</li>
        <li>
          Du musst mindestens <strong>18 Jahre</strong> alt sein, da sich die Community mit einem Spiel ab 18 Jahren beschäftigt.
        </li>
        <li>Pro Person ist ein Konto erlaubt. Halte deine Zugangsdaten geheim.</li>
        <li>Dein Benutzername darf keine fremden Rechte verletzen und nicht beleidigend oder irreführend sein (zum Beispiel nicht den Eindruck erwecken, du gehörst zum Team).</li>
      </ul>

      <h2 id="inhalte">3. Deine Inhalte</h2>
      <ul>
        <li>Du bist für deine Beiträge selbst verantwortlich und darfst nur Inhalte veröffentlichen, an denen du die nötigen Rechte hast.</li>
        <li>
          Mit dem Veröffentlichen erlaubst du uns, deine Beiträge kostenlos auf GTA6-Kompass anzuzeigen und zu speichern (einfaches Nutzungsrecht). Das Recht endet mit der Löschung des Beitrags. Bei
          Fragen, auf die andere bereits geantwortet haben, bleibt der Beitrag nach einer Kontolöschung ohne deinen Namen erhalten.
        </li>
        <li>
          Es gelten zusätzlich unsere <Link href="/community-regeln">Community-Regeln</Link>.
        </li>
      </ul>

      <h2 id="verboten">4. Verbotene Inhalte</h2>
      <ul>
        <li>rechtswidrige Inhalte, zum Beispiel Beleidigungen, Bedrohungen, Volksverhetzung oder Urheberrechtsverletzungen</li>
        <li>Spam, Werbung und Links zu Schadsoftware, Cheat-Verkäufen oder Kontohandel</li>
        <li>Anleitungen zu Cheats in Online-Modi, Raubkopien oder Verstößen gegen die Nutzungsbedingungen des Spiels</li>
        <li>personenbezogene Daten anderer Personen ohne deren Einwilligung</li>
        <li>unmarkierte Story-Spoiler und bewusste Falschinformationen</li>
      </ul>

      <h2 id="moderation">5. Moderation</h2>
      <p>Das Moderationsteam prüft Inhalte vor allem auf Grund von Meldungen. Bei Verstößen können wir</p>
      <ul>
        <li>Beiträge ausblenden oder löschen,</li>
        <li>Fragen schließen,</li>
        <li>Konten vorübergehend oder dauerhaft für neue Beiträge sperren.</li>
      </ul>
      <p>
        Wir entscheiden im Einzelfall und berücksichtigen dabei die Schwere des Verstoßes. Wird ein Beitrag von dir entfernt oder dein Konto gesperrt, erhältst du eine <strong>Benachrichtigung mit Begründung</strong>{" "}
        auf der Seite „Benachrichtigungen“. Automatisierte Entscheidungen setzen wir nicht ein. Ein Spam-Schutz begrenzt lediglich, wie viele Beiträge in kurzer Zeit möglich sind.
      </p>

      <h2 id="widerspruch">6. Widerspruch gegen Entscheidungen</h2>
      <p>
        Du hältst eine Entscheidung für falsch? Schreib uns innerhalb von sechs Monaten über die <Link href="/kontakt">Kontaktseite</Link>. Wir prüfen den Fall erneut durch eine andere Person, soweit
        möglich, und teilen dir das Ergebnis mit.
      </p>

      <h2 id="melden">7. Inhalte melden</h2>
      <p>
        Jede Person kann Inhalte melden, die sie für rechtswidrig oder regelwidrig hält – auch ohne Konto. Nutze dafür den Button „Melden“ am Beitrag oder das <Link href="/melden">Meldeformular</Link>. Eine
        Meldung sollte erklären, warum der Inhalt rechtswidrig ist, wo er zu finden ist, und die Bestätigung enthalten, dass die Angaben nach bestem Wissen richtig sind. Wer eine E-Mail-Adresse angibt oder
        angemeldet ist, erhält eine Rückmeldung zum Ergebnis. Wer wiederholt offensichtlich unbegründete Meldungen sendet, kann von der Meldefunktion ausgeschlossen werden.
      </p>

      <h2 id="kontaktstelle">8. Kontaktstelle</h2>
      <p>
        Zentrale Kontaktstelle für Nutzer und Behörden (Art. 11 und 12 Digital Services Act):{" "}
        {siteConfig.contactEmail ? siteConfig.contactEmail : <Placeholder>E-Mail-Adresse der Kontaktstelle</Placeholder>}. Kommunikation auf Deutsch oder Englisch.
      </p>

      <h2 id="loeschung">9. Konto löschen</h2>
      <p>
        Du kannst dein Konto jederzeit selbst in deinem <Link href="/profil">Profil</Link> löschen. Wir können Konten bei schweren oder wiederholten Verstößen löschen.
      </p>

      <h2 id="haftung">10. Verfügbarkeit und Haftung</h2>
      <p>
        GTA6-Kompass ist ein kostenloses Fanprojekt. Wir bemühen uns um korrekte Informationen und eine gute Erreichbarkeit, können beides aber nicht garantieren.{" "}
        <Placeholder>Haftungsregelung – rechtlich prüfen lassen</Placeholder>
      </p>

      <h2 id="aenderungen">11. Änderungen</h2>
      <p>
        Wir können diese Bedingungen ändern, zum Beispiel bei neuen Funktionen oder geänderter Rechtslage. Über wesentliche Änderungen informieren wir rechtzeitig vorher.
      </p>

      <p>
        Stand: <Placeholder>Datum</Placeholder>
      </p>
    </LegalPage>
  );
}
