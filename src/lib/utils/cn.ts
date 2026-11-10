/** Kleine Hilfsfunktion zum Zusammenfügen von CSS-Klassen. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
