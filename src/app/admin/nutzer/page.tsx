import { requireStaff } from "@/lib/admin/guard";
import { ActionButton } from "@/components/admin/action-button";
import { Avatar } from "@/components/community/avatar";
import { Badge } from "@/components/ui/badge";
import { setUserBannedAction, setUserRoleAction } from "@/lib/admin/actions";
import { hasRole } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils/format";
import type { Profile } from "@/types/community";

const roleLabel = { user: "Mitglied", moderator: "Moderator", admin: "Administrator" } as const;

export default async function NutzerPage() {
  const { supabase, session } = await requireStaff("moderator");
  if (!supabase) return null;
  const isAdmin = hasRole(session, "admin");
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, bio, role, is_banned, created_at")
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<Profile[]>();

  return (
    <div>
      <h1 className="text-3xl font-bold">Nutzer verwalten</h1>
      <p className="mt-1 mb-6 text-muted">{isAdmin ? "Rollen vergeben und Konten sperren." : "Konten sperren oder entsperren. Rollen können nur Administratoren ändern."}</p>
      {error ? (
        <p role="alert" className="text-danger">
          Nutzer konnten nicht geladen werden.
        </p>
      ) : (
        <ul className="grid gap-3">
          {(data ?? []).map((u) => (
            <li key={u.id} className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar name={u.username} url={u.avatar_url} size={36} />
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    {u.username} <Badge accent={u.role === "admin" ? "pink" : u.role === "moderator" ? "teal" : "neutral"}>{roleLabel[u.role]}</Badge>
                    {u.is_banned && <Badge accent="sunset">gesperrt</Badge>}
                  </p>
                  <p className="text-xs text-muted">seit {formatDate(u.created_at)}</p>
                </div>
              </div>
              {u.id !== session.userId && (
                <div className="flex flex-wrap gap-2">
                  {isAdmin &&
                    (["user", "moderator", "admin"] as const)
                      .filter((r) => r !== u.role)
                      .map((r) => (
                        <ActionButton key={r} action={setUserRoleAction.bind(null, u.id, r)} confirm={`Rolle von ${u.username} auf „${roleLabel[r]}“ ändern?`}>
                          → {roleLabel[r]}
                        </ActionButton>
                      ))}
                  {u.role === "user" || isAdmin ? (
                    <ActionButton action={setUserBannedAction.bind(null, u.id, !u.is_banned)} tone={u.is_banned ? "success" : "danger"} confirm={u.is_banned ? undefined : `${u.username} sperren?`}>
                      {u.is_banned ? "Entsperren" : "Sperren"}
                    </ActionButton>
                  ) : null}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
