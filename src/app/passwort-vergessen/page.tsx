import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/password-forms";
import { AuthNotConfigured } from "@/components/auth/not-configured";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Passwort vergessen", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Passwort vergessen?"
      text="Gib deine E-Mail-Adresse ein. Wir senden dir einen Link zum Zurücksetzen."
      footer={
        <Link href="/login" className="font-semibold text-teal hover:text-white">
          Zurück zur Anmeldung
        </Link>
      }
    >
      {isSupabaseConfigured() ? <ForgotPasswordForm /> : <AuthNotConfigured />}
    </AuthShell>
  );
}
