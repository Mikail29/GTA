import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/password-forms";
import { AuthNotConfigured } from "@/components/auth/not-configured";
import { LinkButton } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Neues Passwort festlegen", robots: { index: false } };

export default async function NewPasswordPage() {
  const configured = isSupabaseConfigured();
  const session = configured ? await getSession() : null;
  return (
    <AuthShell title="Neues Passwort" text="Lege ein neues, sicheres Passwort für dein Konto fest.">
      {!configured ? (
        <AuthNotConfigured />
      ) : session ? (
        <ResetPasswordForm />
      ) : (
        <div className="grid gap-4 text-sm text-muted">
          <p>Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an.</p>
          <LinkButton href="/passwort-vergessen">Neuen Link anfordern</LinkButton>
        </div>
      )}
    </AuthShell>
  );
}
