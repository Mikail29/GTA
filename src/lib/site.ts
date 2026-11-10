/** Zentrale Seitenkonfiguration. */
export const siteConfig = {
  name: "5-Sterne-Kompass",
  claim: "Dein Weg durch GTA 6.",
  description:
    "Der 5-Sterne-Kompass ist das unabhängige, deutschsprachige und kostenlose Fan- und Hilfeportal zu GTA 6: Tipps, Missionen, Geheimnisse, Karte und Community.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "de_DE",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  disclaimer:
    "Der 5-Sterne-Kompass ist ein unabhängiges Fanprojekt und steht in keiner Verbindung zu Rockstar Games oder Take-Two Interactive. Alle genannten Marken gehören ihren jeweiligen Inhabern.",
};

export interface NavItem {
  href: string;
  label: string;
  /** Bereich ist angekündigt, aber noch nicht verfügbar („Bald“). */
  soon?: boolean;
}

export const mainNav: NavItem[] = [
  { href: "/tipps", label: "Tipps" },
  { href: "/missionen", label: "Missionen" },
  { href: "/geheimnisse", label: "Geheimnisse" },
  { href: "/karte", label: "Karte" },
  { href: "/news", label: "News" },
  { href: "/online", label: "Online", soon: true },
  { href: "/community", label: "Community" },
];

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
