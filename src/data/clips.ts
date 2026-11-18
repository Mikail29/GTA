/**
 * Kanäle für die Seite „GTA 6 Clips“.
 * Die Links trägt der Betreiber nach (url). Solange url fehlt, zeigt die Seite
 * „Link folgt in Kürze“.
 *
 * Es sind nur Links: Beim Aufruf unserer Seite wird nichts von YouTube, Instagram
 * oder TikTok geladen. Erst wer einen Link anklickt, wechselt zur Plattform.
 * Sollen Videos später direkt auf der Seite abspielbar sein, nur mit
 * Zwei-Klick-Lösung (Laden erst nach Klick) und Ergänzung der Datenschutzerklärung.
 */
export type ClipPlatform = "youtube" | "instagram" | "tiktok";

export interface ClipChannel {
  platform: ClipPlatform;
  name: string;
  text: string;
  /** Link zum Kanal, z. B. https://www.youtube.com/@… */
  url?: string;
}

export const clipChannels: ClipChannel[] = [
  { platform: "youtube", name: "YouTube", text: "Längere Videos, Trailer, Erklärungen und Highlights.", url: "https://www.youtube.com/@5SterneKompass" },
  { platform: "instagram", name: "Instagram", text: "Kurze Clips, Reels und Bilder aus Vice City.", url: "https://www.instagram.com/5sternekompass" },
  { platform: "tiktok", name: "TikTok", text: "Schnelle Clips, Tricks und lustige Momente.", url: "https://www.tiktok.com/@5sternekompass" },
];
