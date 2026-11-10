import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Verarbeitet Bestätigungs- und Passwort-Links aus Supabase-E-Mails.
 * Unterstützt den PKCE-Flow (?code=…) und Token-Hash-Links (?token_hash=…&type=…).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const rawNext = searchParams.get("next") ?? "/profil";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/profil";

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.redirect(`${origin}/login`);

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  }

  if (!ok) return NextResponse.redirect(`${origin}/login?fehler=link`);
  const target = type === "recovery" ? "/passwort-neu" : next;
  return NextResponse.redirect(`${origin}${target}`);
}
