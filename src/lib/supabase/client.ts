"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseUrl } from "@/lib/env";

/** Supabase-Client für Client Components (nur mit öffentlichem Anon-Key). */
export function createSupabaseBrowserClient() {
  const url = supabaseUrl();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
