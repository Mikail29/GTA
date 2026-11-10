import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Community-Regeln",
  description: "Die Regeln für ein faires und freundliches Miteinander in der GTA6-Kompass-Community.",
  alternates: { canonical: "/community-regeln" },
};

export default function RegelnPage() {
  return (
    <LegalPage title="Community-Regeln" text="Damit sich alle wohlfühlen: unsere Grundregeln für Fragen, Antworten und Kommentare." crumb="Community-Regeln" review={false}>
      <h2 id="respekt">1. Respektvoller Umgang</h2>
      <p>Keine Beleidigungen, keine Diskriminierung, keine Belästigung. Kritik ist willkommen – sachlich und freundlich.</p>
      <h2 id="spoiler">2. Spoiler kennzeichnen</h2>
      <p>Wer über Story-Inhalte schreibt, kündigt Spoiler im Titel oder am Anfang des Beitrags deutlich an.</p>
      <h2 id="wahrheit">3. Ehrlich bleiben</h2>
      <p>Gerüchte bitte als Gerüchte kennzeichnen. Bewusste Falschinformationen werden entfernt. Quellen helfen allen.</p>
      <h2 id="spam">4. Kein Spam, keine Werbung</h2>
      <p>Keine Werbung, keine Links zu Schadsoftware, Cheat-Verkäufern oder Account-Handel.</p>
      <h2 id="recht">5. Recht und Fairplay</h2>
      <ul>
        <li>Keine Anleitungen zu Cheats in Online-Modi, Exploits oder Verstößen gegen Nutzungsbedingungen.</li>
        <li>Keine Raubkopien, keine urheberrechtlich geschützten Inhalte ohne Erlaubnis.</li>
        <li>Keine personenbezogenen Daten anderer Personen veröffentlichen.</li>
      </ul>
      <h2 id="moderation">6. Moderation</h2>
      <p>
        Moderatoren können Beiträge ausblenden, Fragen schließen und Konten bei wiederholten Verstößen sperren. Nutze die Melden-Funktion, wenn dir ein Beitrag auffällt – das Moderationsteam prüft jede
        Meldung. Melden geht auch ohne Konto über das <Link href="/melden">Meldeformular</Link>. Bei Moderationsentscheidungen erhältst du eine Begründung und kannst widersprechen – Details in den{" "}
        <Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link>.
      </p>
    </LegalPage>
  );
}
