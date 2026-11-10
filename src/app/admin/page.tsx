import Link from "next/link";
import { Flag, MessagesSquare, Newspaper, Users } from "lucide-react";
import { requireStaff } from "@/lib/admin/guard";

export default async function AdminDashboard() {
  const { supabase, session } = await requireStaff("moderator");
  if (!supabase) return null;

  const head = { count: "exact" as const, head: true };
  const results = await Promise.all([
    supabase.from("reports").select("*", head).eq("status", "offen"),
    supabase.from("questions").select("*", head),
    supabase.from("answers").select("*", head),
    supabase.from("profiles").select("*", head),
    supabase.from("articles").select("*", head),
  ]);
  const [openReports, questions, answers, users, articles] = results.map((r) => r.count ?? 0);

  const stats = [
    { label: "Offene Meldungen", value: openReports, href: "/admin/meldungen", Icon: Flag, accent: "text-sunset" },
    { label: "Fragen", value: questions, href: "/admin/beitraege", Icon: MessagesSquare, accent: "text-pink" },
    { label: "Antworten", value: answers, href: "/admin/beitraege", Icon: MessagesSquare, accent: "text-teal" },
    { label: "Nutzer", value: users, href: "/admin/nutzer", Icon: Users, accent: "text-[#b89bff]" },
    { label: "Artikel (Datenbank)", value: articles, href: "/admin/inhalte", Icon: Newspaper, accent: "text-teal" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted">
        Hallo {session.profile?.username}! Du bist als <strong className="text-white">{session.profile?.role === "admin" ? "Administrator" : "Moderator"}</strong> angemeldet.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, href, Icon, accent }) => (
          <li key={label}>
            <Link href={href} className="surface flex items-center gap-4 p-5 transition hover:border-pink/40">
              <Icon className={`size-8 ${accent}`} aria-hidden="true" />
              <span>
                <span className="block font-display text-3xl font-bold">{value}</span>
                <span className="text-sm text-muted">{label}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
