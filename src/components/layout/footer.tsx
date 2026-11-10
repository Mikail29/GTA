import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Inhalte",
    links: [
      { href: "/tipps", label: "Tipps & Tricks" },
      { href: "/missionen", label: "Missionen" },
      { href: "/geheimnisse", label: "Geheimnisse" },
      { href: "/karte", label: "Interaktive Karte" },
      { href: "/news", label: "News" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/community", label: "Übersicht" },
      { href: "/fragen", label: "Fragen & Antworten" },
      { href: "/community#starter", label: "GTA 6 Starter" },
      { href: "/community-regeln", label: "Community-Regeln" },
      { href: "/melden", label: "Inhalt melden" },
    ],
  },
  {
    title: "Projekt",
    links: [
      { href: "/ueber-uns", label: "Über den 5-Sterne-Kompass" },
      { href: "/kontakt", label: "Kontakt" },
      { href: "/impressum", label: "Impressum" },
      { href: "/nutzungsbedingungen", label: "Nutzungsbedingungen" },
      { href: "/datenschutz", label: "Datenschutz" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line/60 bg-night-2">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-pink/60 to-transparent" />
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm text-muted">{siteConfig.claim} Das unabhängige, deutschsprachige und kostenlose Hilfeportal rund um Grand Theft Auto VI.</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">{col.title}</h2>
              <ul className="grid gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted transition hover:text-teal">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-line bg-card/60 p-4 text-xs leading-relaxed text-muted">
          <strong className="text-white">Hinweis zur Unabhängigkeit:</strong> {siteConfig.disclaimer} Es werden keine offiziellen Logos,
          Screenshots, Karten oder Texte von Rockstar Games verwendet.
        </div>
        <p className="mt-6 text-xs text-muted">© {new Date().getFullYear()} 5-Sterne-Kompass · Fanprojekt · Alle Grafiken selbst erstellt.</p>
      </Container>
    </footer>
  );
}
