import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/profil", "/auth/", "/suche", "/passwort-neu", "/passwort-vergessen", "/fragen/neu", "/benachrichtigungen", "/konto-geloescht"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
