import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Placeholder } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "Datenschutzerklärung", alternates: { canonical: "/datenschutz" } };

function Mail() {
  return siteConfig.contactEmail ? <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> : <Placeholder>E-Mail-Adresse</Placeholder>;
}

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung" text="Informationen zur Verarbeitung personenbezogener Daten auf dem 5-Sterne-Kompass." crumb="Datenschutz" review={false}>
      <p>
        Wir verarbeiten nur die Daten, die für den Betrieb der Website und der Community nötig sind. Hier erfährst du, welche Daten das sind, wofür wir sie nutzen, wie lange wir sie speichern und welche
        Rechte du hast.
      </p>

      <h2 id="verantwortlicher">1. Verantwortliche</h2>
      <p>
        Mikail Koyun und Jamie Can Koyun (5-Sterne-Kompass)
        <br />
        Mühlenweg 35
        <br />
        57555 Mudersbach
        <br />
        E-Mail: <Mail />
      </p>

      <h2 id="grundsaetze">2. Grundsätze</h2>
      <ul>
        <li>Kein Tracking, keine Analyse- oder Werbe-Cookies, keine Social-Media-Plugins.</li>
        <li>Schriftarten werden von unserem eigenen Server geladen – es werden keine Verbindungen zu Google Fonts aufgebaut.</li>
        <li>Die Karte nutzt eine eigene Grafik und lädt keine Kartendienste Dritter.</li>
        <li>Teilen-Funktionen nutzen die Funktionen deines Geräts und laden keine Inhalte Dritter.</li>
        <li>Wir verkaufen keine Daten. Wir geben sie nur an die unten genannten Dienstleister weiter, die sie in unserem Auftrag verarbeiten.</li>
      </ul>

      <h2 id="hosting">3. Hosting und Server-Logfiles</h2>
      <p>
        Die Website wird bei Netlify, Inc. (USA) betrieben; auch die Adressauflösung unserer Domain (DNS) läuft über Netlify. Beim Aufruf einer Seite verarbeitet Netlify technisch notwendige Daten: IP-Adresse,
        Datum und Uhrzeit, aufgerufene Seite, übertragene Datenmenge, Browser und Betriebssystem sowie die zuvor besuchte Seite. Das ist nötig, um die Website auszuliefern und vor Angriffen zu schützen.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und funktionierenden Betrieb). Mit Netlify besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO).
        Netlify verarbeitet Daten auch in den USA und stützt sich dabei auf das EU-US Data Privacy Framework (Angemessenheitsbeschluss der EU-Kommission, Art. 45 DSGVO) sowie auf
        EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO). Wir selbst werten keine Logfiles aus; wie lange Netlify sie aufbewahrt, legt Netlify in seinen Datenschutzhinweisen fest.
      </p>

      <h2 id="cookies">4. Cookies und lokaler Speicher</h2>
      <ul>
        <li>
          <strong>Anmelde-Cookies</strong> (nur, wenn du dich anmeldest): Sie halten dich angemeldet, bis du dich abmeldest.
        </li>
        <li>
          <strong>Lokaler Speicher deines Browsers</strong>: Er merkt sich, ob du den Datenschutz-Hinweis geschlossen hast, und deine „Hilfreich?“-Bewertungen. Diese Angaben bleiben auf deinem Gerät, werden
          nicht an uns übertragen und lassen sich jederzeit in deinem Browser löschen.
        </li>
      </ul>
      <p>
        Beides ist technisch notwendig für Funktionen, die du selbst nutzt. Eine Einwilligung ist dafür nicht erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).
      </p>

      <h2 id="konto">5. Benutzerkonto und Community</h2>
      <p>
        Für ein Konto speichern wir E-Mail-Adresse, Benutzername und Passwort (nur verschlüsselt als sogenannter Hash) sowie, wenn du sie angibst, Profilbild und Kurzbeschreibung. Deine Fragen, Antworten,
        Kommentare, Likes und Meldungen werden mit deinem Konto gespeichert. Benutzername, Profilbild und Beiträge sind öffentlich sichtbar, deine E-Mail-Adresse nicht. Die E-Mail-Adresse nutzen wir für
        die Anmeldung und zum Zurücksetzen des Passworts.
      </p>
      <p>
        Lesen kannst du alles ohne Konto. Zum Schreiben brauchst du ein Konto; die Angaben bei der Registrierung sind dafür erforderlich. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Nutzungsvertrag nach
        unseren <Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link>).
      </p>
      <p>
        Zum Schutz vor Missbrauch – zum Beispiel zu vielen Anmeldeversuchen, Spam oder massenhaften Meldungen – wird deine IP-Adresse kurzzeitig im Arbeitsspeicher des Servers verarbeitet und nicht dauerhaft
        gespeichert (Art. 6 Abs. 1 lit. f DSGVO).
      </p>
      <p>
        Datenbank, Anmeldung und Dateispeicher (Profilbilder) stellt Supabase bereit (Supabase Pte. Ltd., Singapur). Die Daten liegen in einem Rechenzentrum in der EU (Frankfurt am Main). Mit Supabase
        besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO). Soweit Supabase und seine verbundenen Unternehmen Daten außerhalb der EU verarbeiten, etwa in Singapur oder den USA, gelten die
        EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).
      </p>

      <h2 id="email">6. E-Mails und Kontakt</h2>
      <p>
        Wenn du uns eine E-Mail schreibst, zum Beispiel über die <Link href="/kontakt">Kontaktseite</Link>, verarbeiten wir deine E-Mail-Adresse und deine Nachricht, um dir zu antworten (Art. 6 Abs. 1
        lit. f DSGVO; bei Fragen zu deinem Konto Art. 6 Abs. 1 lit. b DSGVO). Das Kontaktformular öffnet dein E-Mail-Programm; die Nachricht wird erst beim Absenden übertragen.
      </p>
      <p>
        Unser E-Mail-Postfach und der Versand von System-E-Mails (zum Beispiel „Passwort vergessen“) laufen über IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, Deutschland. Mit IONOS besteht ein Vertrag
        zur Auftragsverarbeitung (Art. 28 DSGVO).
      </p>

      <h2 id="meldungen">7. Meldungen und Moderation</h2>
      <p>
        Wenn du einen Inhalt meldest, speichern wir den gemeldeten Inhalt, den Grund, deine Erklärung, deine Bestätigung, dass die Angaben richtig sind, und – falls du angemeldet bist – dein Konto. Bei
        Meldungen ohne Konto speichern wir deine E-Mail-Adresse nur, wenn du sie angibst, um dich über das Ergebnis zu informieren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit Art. 16
        und 17 Digital Services Act sowie Art. 6 Abs. 1 lit. f DSGVO (eine sichere Community).
      </p>
      <p>
        Bei Moderationsentscheidungen, zum Beispiel wenn ein Beitrag ausgeblendet oder ein Konto gesperrt wird, erhältst du eine Benachrichtigung mit Begründung in deinem Konto.
      </p>

      <h2 id="loeschen">8. Konto löschen</h2>
      <p>
        Du kannst dein Konto jederzeit selbst in deinem <Link href="/profil">Profil</Link> löschen. Dabei werden Konto, Profil, Profilbild, Antworten, Kommentare, Likes, Benachrichtigungen und Fragen ohne
        Antworten gelöscht. Fragen, auf die andere bereits geantwortet haben, bleiben ohne Bezug zu deiner Person erhalten.
      </p>

      <h2 id="speicherdauer">9. Speicherdauer</h2>
      <ul>
        <li>
          <strong>Konto, Profil und Beiträge:</strong> bis du sie oder dein Konto löschst.
        </li>
        <li>
          <strong>Gelöschte Inhalte:</strong> werden sofort aus der Datenbank entfernt. In technischen Sicherungskopien unseres Dienstleisters können sie noch kurze Zeit enthalten sein, bis diese
          automatisch überschrieben werden.
        </li>
        <li>
          <strong>Meldungen:</strong> bis zur Entscheidung und danach 6 Monate – so lange kann man der Entscheidung widersprechen. Danach werden sie automatisch gelöscht, auch eine angegebene
          E-Mail-Adresse.
        </li>
        <li>
          <strong>Von der Moderation ausgeblendete Beiträge:</strong> 6 Monate nach dem Ausblenden, danach werden sie automatisch gelöscht.
        </li>
        <li>
          <strong>Benachrichtigungen:</strong> 12 Monate, oder früher, wenn du sie oder dein Konto löschst.
        </li>
        <li>
          <strong>E-Mails an uns:</strong> bis deine Anfrage erledigt ist, danach höchstens 6 Monate.
        </li>
        <li>
          <strong>IP-Adresse zum Schutz vor Missbrauch:</strong> nur im Arbeitsspeicher, in der Regel höchstens eine Stunde.
        </li>
        <li>
          <strong>Server-Logfiles:</strong> nach den Vorgaben von Netlify (siehe Abschnitt 3).
        </li>
      </ul>
      <p>Länger speichern wir Daten nur, wenn ein Gesetz das verlangt oder wir sie zur Verteidigung von Rechtsansprüchen benötigen.</p>

      <h2 id="rechte">10. Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Viele Angaben kannst du
        direkt in deinem Profil ändern oder löschen. Für alles andere genügt eine E-Mail an <Mail />.
      </p>
      <p>
        <strong>Widerspruchsrecht:</strong> Soweit wir Daten auf Grundlage berechtigter Interessen verarbeiten (Art. 6 Abs. 1 lit. f DSGVO), kannst du dem aus Gründen, die sich aus deiner besonderen
        Situation ergeben, jederzeit widersprechen (Art. 21 DSGVO).
      </p>
      <p>
        Du kannst dich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren. Für uns zuständig ist der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz, Hintere
        Bleiche 34, 55116 Mainz,{" "}
        <a href="https://www.datenschutz.rlp.de" target="_blank" rel="noopener noreferrer">
          www.datenschutz.rlp.de
        </a>
        .
      </p>

      <h2 id="automatisiert">11. Keine automatisierten Entscheidungen</h2>
      <p>
        Wir setzen keine automatisierte Entscheidungsfindung und kein Profiling im Sinne von Art. 22 DSGVO ein. Ein Spam-Schutz begrenzt lediglich, wie viele Beiträge in kurzer Zeit möglich sind.
      </p>

      <p>Stand: 19. November 2026</p>
    </LegalPage>
  );
}
