import { requireStaff } from "@/lib/admin/guard";
import { ActionButton } from "@/components/admin/action-button";
import { CategoryForm } from "@/components/admin/category-form";
import { Badge } from "@/components/ui/badge";
import { Notice } from "@/components/ui/notice";
import { deleteCategoryAction, setArticlePublishedAction } from "@/lib/admin/actions";
import { hasRole } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils/format";

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  is_published: boolean;
  updated_at: string;
}
interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  section: string;
}

export default async function InhaltePage() {
  const { supabase, session } = await requireStaff("moderator");
  if (!supabase) return null;
  const isAdmin = hasRole(session, "admin");
  const [{ data: articles }, { data: categories }] = await Promise.all([
    supabase.from("articles").select("id, slug, title, status, is_published, updated_at").order("updated_at", { ascending: false }).limit(100).returns<ArticleRow[]>(),
    supabase.from("categories").select("id, slug, name, section").order("section").order("name").returns<CategoryRow[]>(),
  ]);

  return (
    <div className="grid gap-10">
      <section>
        <h1 className="text-3xl font-bold">Artikel & Kategorien</h1>
        <Notice tone="info" className="mt-4">
          Die öffentlichen Ratgeber stammen aktuell aus statischen Demo-Daten (<code>src/data</code>). Artikel in der Datenbank-Tabelle <code>articles</code> können hier veröffentlicht oder
          zurückgezogen werden. Ein vollständiger Artikel-Editor ist als offene Funktion dokumentiert.
        </Notice>
        <h2 className="mt-8 mb-3 text-xl font-bold">Artikel in der Datenbank</h2>
        {!articles?.length ? (
          <p className="text-sm text-muted">Noch keine Artikel in der Datenbank. Beispieldaten lassen sich über supabase/seed.sql anlegen.</p>
        ) : (
          <ul className="grid gap-3">
            {articles.map((a) => (
              <li key={a.id} className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-xs text-muted">
                    /{a.slug} · Status: {a.status} · geändert {formatDate(a.updated_at)}
                  </p>
                </div>
                <Badge accent={a.is_published ? "teal" : "neutral"}>{a.is_published ? "veröffentlicht" : "Entwurf"}</Badge>
                {isAdmin && (
                  <ActionButton action={setArticlePublishedAction.bind(null, a.id, !a.is_published)} tone={a.is_published ? "danger" : "success"}>
                    {a.is_published ? "Zurückziehen" : "Veröffentlichen"}
                  </ActionButton>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">Kategorien</h2>
        {isAdmin && (
          <div className="surface mb-4 p-5">
            <CategoryForm />
          </div>
        )}
        <ul className="grid gap-2">
          {(categories ?? []).map((c) => (
            <li key={c.id} className="surface flex items-center gap-3 px-4 py-3 text-sm">
              <Badge>{c.section}</Badge>
              <span className="flex-1">
                {c.name} <span className="text-muted">({c.slug})</span>
              </span>
              {isAdmin && (
                <ActionButton action={deleteCategoryAction.bind(null, c.id)} tone="danger" confirm={`Kategorie „${c.name}“ löschen?`}>
                  Löschen
                </ActionButton>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
