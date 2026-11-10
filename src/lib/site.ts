/** Zentrale Seitenkonfiguration. */
export const siteConfig = {
  name: "GTA6-Kompass",
  claim: "Dein Weg durch GTA 6.",
  description:
    "GTA6-Kompass ist das unabhängige, deutschsprachige und kostenlose Fan- und Hilfeportal zu GTA 6: Tipps, Missionen, Geheimnisse, Karte und Community.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "de_DE",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  disclaimer:
    "GTA6-Kompass ist ein unabhängiges Fanprojekt und steht in keiner Verbindung zu Rockstar Games oder Take-Two Interactive. Alle genannten Marken gehören ihren jeweiligen Inhabern.",
};

export const mainNav = [
  { href: "/tipps", label: "Tipps" },
  { href: "/missionen", label: "Missionen" },
  { href: "/geheimnisse", label: "Geheimnisse" },
  { href: "/karte", label: "Karte" },
  { href: "/news", label: "News" },
  { href: "/community", label: "Community" },
] as const;

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
