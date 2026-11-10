import type { Metadata } from "next";
import { LegalPage, Placeholder } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Datenschutzerklärung", alternates: { canonical: "/datenschutz" } };

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung" text="Informationen zur Verarbeitung personenbezogener Daten auf GTA6-Kompass." crumb="Datenschutz">
      <p>
        Diese Vorlage beschreibt die technisch tatsächlich umgesetzten Datenverarbeitungen der Website. Rechtliche Formulierungen, Rechtsgrundlagen und Angaben zu Auftragsverarbeitern müssen vom Betreiber
        geprüft und ergänzt werden.
      </p>

      <h2 id="verantwortlicher">1. Verantwortlicher</h2>
      <p>
        <Placeholder>Name, Anschrift und E-Mail-Adresse des Verantwortlichen</Placeholder>
      </p>

      <h2 id="grundsaetze">2. Grundsätze</h2>
      <ul>
        <li>Kein Tracking, keine Analyse- oder Werbe-Cookies, keine Social-Media-Plugins.</li>
        <li>Schriftarten werden lokal ausgeliefert – es werden keine Verbindungen zu Google Fonts aufgebaut.</li>
        <li>Teilen-Funktionen nutzen die Funktionen deines Geräts und laden keine Inhalte Dritter.</li>
      </ul>

      <h2 id="hosting">3. Hosting und Server-Logfiles</h2>
      <p>
        Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch notwendige Daten (z. B. IP-Adresse, Zeitpunkt, aufgerufene Seite, Browser-Informationen). Hosting-Anbieter:{" "}
        <Placeholder>Anbieter, Sitz, Speicherdauer der Logs, Rechtsgrundlage</Placeholder>
      </p>

      <h2 id="cookies">4. Cookies und lokaler Speicher</h2>
      <ul>
        <li>
          <strong>Anmelde-Cookies</strong> (nur bei Nutzung eines Kontos): technisch notwendig, um dich angemeldet zu halten.
        </li>
        <li>
          <strong>Lokaler Speicher im Browser</strong>: speichert, ob du den Datenschutz-Hinweis geschlossen hast, deine „Hilfreich?“-Bewertungen sowie den KI-Chatverlauf (nur für die Dauer des
          Browser-Tabs). Diese Daten verlassen dein Gerät nicht.
        </li>
      </ul>

      <h2 id="konto">5. Benutzerkonto und Community</h2>
      <p>
        Bei der Registrierung speichern wir E-Mail-Adresse, Benutzername, Passwort (nur als sicherer Hash beim Authentifizierungsdienst) sowie optional Profilbild und Kurzbeschreibung. Beiträge, Antworten,
        Kommentare, Likes und Meldungen werden mit deinem Konto verknüpft gespeichert. Benutzername, Profilbild und Beiträge sind öffentlich sichtbar, die E-Mail-Adresse nicht.
      </p>
      <p>
        Datenbank, Authentifizierung und Dateispeicher werden über Supabase bereitgestellt: <Placeholder>Anbieterangaben, Serverstandort/Region, Auftragsverarbeitungsvertrag, Rechtsgrundlage</Placeholder>
      </p>

      <h2 id="ki">6. KI-Assistent</h2>
      <p>
        Wenn du den KI-Assistenten nutzt, werden deine Nachrichten und der aktuelle Gesprächsverlauf an unseren Server und von dort an den eingesetzten KI-Anbieter übermittelt, um eine Antwort zu erzeugen. Bitte
        gib keine personenbezogenen Daten ein. Zum Schutz vor Missbrauch wird deine IP-Adresse kurzzeitig im Arbeitsspeicher für das Anfragelimit verarbeitet.
      </p>
      <p>
        Eingesetzter Anbieter: <Placeholder>Name des KI-Anbieters, Sitz, Datenübermittlung in Drittländer, Speicherdauer, Rechtsgrundlage</Placeholder>
      </p>

      <h2 id="kontakt">7. Kontaktaufnahme</h2>
      <p>Das Kontaktformular öffnet dein E-Mail-Programm; die Nachricht wird erst beim Absenden aus deinem E-Mail-Programm übertragen.</p>

      <h2 id="rechte">8. Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht auf Beschwerde bei einer Aufsichtsbehörde.{" "}
        <Placeholder>Zuständige Aufsichtsbehörde und Kontaktweg für Anfragen</Placeholder>
      </p>

      <h2 id="speicherdauer">9. Speicherdauer</h2>
      <p>
        <Placeholder>Löschfristen für Konten, Beiträge, Meldungen und Logs festlegen</Placeholder>
      </p>

      <p>
        Stand: <Placeholder>Datum</Placeholder>
      </p>
    </LegalPage>
  );
}
