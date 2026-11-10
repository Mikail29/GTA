import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthNotConfigured } from "@/components/auth/not-configured";
import { getSession } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Registrieren", description: "Erstelle kostenlos dein Konto beim 5-Sterne-Kompass.", alternates: { canonical: "/registrieren" } };

export default async function RegisterPage() {
  if (await getSession()) redirect("/profil");
  return (
    <AuthShell
      title="Konto erstellen"
      text="Kostenlos, ohne Werbung, ohne Tracking."
      footer={
        <>
          Schon dabei?{" "}
          <Link href="/login" className="font-semibold text-teal hover:text-white">
            Anmelden
          </Link>
        </>
      }
    >
      {isSupabaseConfigured() ? <RegisterForm /> : <AuthNotConfigured />}
    </AuthShell>
  );
}
