import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { AuthNotConfigured } from "@/components/auth/not-configured";
import { Notice } from "@/components/ui/notice";
import { getSession } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/env";
import { param, type SearchParams } from "@/lib/utils/params";

export const metadata: Metadata = { title: "Anmelden", robots: { index: false }, alternates: { canonical: "/login" } };

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const rawNext = param(sp.next, 200);
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : undefined;
  if (await getSession()) redirect(next ?? "/profil");
  const error = param(sp.fehler);

  return (
    <AuthShell
      title="Willkommen zurück"
      text="Melde dich an, um Fragen zu stellen und mitzudiskutieren."
      footer={
        <>
          Noch kein Konto?{" "}
          <Link href="/registrieren" className="font-semibold text-teal hover:text-white">
            Jetzt registrieren
          </Link>
        </>
      }
    >
      {error && (
        <Notice tone="error" className="mb-5">
          Der Bestätigungslink ist ungültig oder abgelaufen. Bitte versuche es erneut.
        </Notice>
      )}
      {isSupabaseConfigured() ? <LoginForm next={next} /> : <AuthNotConfigured />}
    </AuthShell>
  );
}
