import Link from "next/link";
import { Bell, LogIn, Rocket, UserPlus, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavLinks } from "@/components/navigation/nav-links";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { HeaderSearch } from "@/components/search/header-search";
import { UserMenu } from "@/components/navigation/user-menu";
import { getSession } from "@/lib/auth/session";
import { countUnread } from "@/lib/community/notifications";

export async function Header() {
  const session = await getSession();
  const unread = session ? await countUnread(session.userId) : 0;
  const user = session ? { username: session.profile?.username ?? "Profil", avatarUrl: session.profile?.avatar_url ?? null, role: session.profile?.role ?? "user" } : null;

  return (
    <header className="glass sticky top-0 z-50 border-b border-line/60">
      <a href="#inhalt" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-pink focus:px-4 focus:py-2 focus:text-night">
        Zum Inhalt springen
      </a>
      <Container className="flex h-16 items-center gap-4">
        <Logo />
        <NavLinks className="ml-2 hidden xl:flex" />
        <div className="ml-auto flex items-center gap-2">
          <HeaderSearch />
          <Link href="/community" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-white lg:inline-flex xl:hidden">
            <Users className="size-4" aria-hidden="true" /> Community
          </Link>
          <Link href="/community#starter" className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-teal/30 bg-teal/5 px-3 py-2 text-sm font-medium text-teal transition hover:bg-teal/15 lg:inline-flex xl:hidden 2xl:inline-flex">
            <Rocket className="size-4" aria-hidden="true" /> GTA 6 Starter
          </Link>
          {user && (
            <Link
              href="/benachrichtigungen"
              aria-label={unread ? `Benachrichtigungen, ${unread} ungelesen` : "Benachrichtigungen"}
              className="relative grid size-10 place-items-center rounded-full border border-line bg-card text-muted transition hover:border-pink/50 hover:text-white"
            >
              <Bell className="size-4" aria-hidden="true" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-pink px-1 text-[10px] font-bold text-night">{unread > 9 ? "9+" : unread}</span>
              )}
            </Link>
          )}
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <LinkButton href="/login" variant="ghost" size="sm">
                <LogIn className="size-4" aria-hidden="true" /> Login
              </LinkButton>
              <LinkButton href="/registrieren" size="sm">
                <UserPlus className="size-4" aria-hidden="true" /> Registrieren
              </LinkButton>
            </div>
          )}
          <MobileMenu loggedIn={Boolean(user)} />
        </div>
      </Container>
    </header>
  );
}
