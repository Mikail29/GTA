import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { AdminNav } from "@/components/admin/admin-nav";
import { Notice } from "@/components/ui/notice";
import { requireStaff } from "@/lib/admin/guard";

export const metadata: Metadata = { title: "Verwaltung", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { supabase } = await requireStaff("moderator");
  if (!supabase) {
    return (
      <Container className="py-16">
        <Notice tone="research" title="Verwaltung nicht verfügbar">
          Der Admin-Bereich benötigt eine eingerichtete Supabase-Datenbank. Bitte folge der Anleitung in der README.
        </Notice>
      </Container>
    );
  }
  return (
    <Container className="grid gap-8 py-10 lg:grid-cols-[220px_1fr]">
      <aside>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">Verwaltung</p>
        <AdminNav />
      </aside>
      <div className="min-w-0">{children}</div>
    </Container>
  );
}
