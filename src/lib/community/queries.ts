import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { demoAnswers, demoQuestions } from "@/data/demo-questions";
import { starterThreads } from "@/data/starter-threads";
import { matchesQuery } from "@/lib/utils/format";
import type { Answer, Question } from "@/types/community";

/**
 * Lesender Zugriff auf Community-Inhalte.
 * Ist Supabase konfiguriert, kommen die Daten aus der Datenbank (RLS blendet
 * versteckte Inhalte automatisch aus). Andernfalls werden gekennzeichnete
 * Demo-Fragen geliefert.
 */

const QUESTION_SELECT =
  "id, author_id, title, body, category, status, is_hidden, created_at, updated_at, likes_count, answers_count, is_pinned, is_official, author:profiles!questions_author_id_fkey(username, avatar_url)";
const ANSWER_SELECT =
  "id, question_id, author_id, body, created_at, updated_at, likes_count, author:profiles!answers_author_id_fkey(username, avatar_url)";

export interface QuestionQuery {
  q?: string;
  category?: string;
  sort?: "neu" | "beliebt" | "unbeantwortet";
  limit?: number;
  /** Angeheftete Threads zuerst anzeigen (Standard bei Sortierung „neu“). */
  pinnedFirst?: boolean;
}

export async function listQuestions(opts: QuestionQuery = {}): Promise<{ questions: Question[]; demo: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const limit = Math.min(opts.limit ?? 30, 100);

  if (!supabase) {
    let list = [...starterThreads, ...demoQuestions].filter((q) => (!opts.category || q.category === opts.category) && (!opts.q || matchesQuery(opts.q, q.title, q.body)));
    if (opts.sort === "beliebt") list = [...list].sort((a, b) => b.likes_count - a.likes_count);
    else if (opts.sort === "unbeantwortet") list = list.filter((q) => q.answers_count === 0);
    else list = [...list].sort((a, b) => (opts.pinnedFirst ? Number(!!b.is_pinned) - Number(!!a.is_pinned) : 0) || b.created_at.localeCompare(a.created_at));
    return { questions: list.slice(0, limit), demo: true };
  }

  let query = supabase.from("questions").select(QUESTION_SELECT).eq("is_hidden", false).limit(limit);
  if (opts.category) query = query.eq("category", opts.category);
  if (opts.q) {
    // Sonderzeichen entfernen, die die PostgREST-Filtersyntax stören könnten
    const term = opts.q.replace(/[%,()*\\]/g, " ").trim().slice(0, 100);
    if (term) query = query.or(`title.ilike.%${term}%,body.ilike.%${term}%`);
  }
  if (opts.sort === "beliebt") query = query.order("likes_count", { ascending: false });
  else if (opts.sort === "unbeantwortet") query = query.eq("answers_count", 0).order("created_at", { ascending: false });
  else {
    if (opts.pinnedFirst) query = query.order("is_pinned", { ascending: false });
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query.returns<Question[]>();
  if (error) return { questions: [], demo: false, error: "Die Fragen konnten nicht geladen werden." };
  return { questions: data ?? [], demo: false };
}

export async function getQuestion(id: string): Promise<{ question: Question | null; answers: Answer[]; demo: boolean }> {
  if (id.startsWith("demo-") || id.startsWith("starter-")) {
    const question = [...starterThreads, ...demoQuestions].find((q) => q.id === id) ?? null;
    return { question, answers: demoAnswers[id] ?? [], demo: true };
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase || !/^[0-9a-f-]{36}$/i.test(id)) return { question: null, answers: [], demo: !supabase };

  const { data: question } = await supabase.from("questions").select(QUESTION_SELECT).eq("id", id).maybeSingle<Question>();
  if (!question) return { question: null, answers: [], demo: false };

  const { data: answers } = await supabase
    .from("answers")
    .select(ANSWER_SELECT)
    .eq("question_id", id)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true })
    .returns<Answer[]>();

  return { question, answers: answers ?? [], demo: false };
}

/** Welche Inhalte hat der aktuelle Nutzer bereits geliked? */
export async function getLikedIds(userId: string | undefined, targetIds: string[]) {
  if (!userId || targetIds.length === 0) return new Set<string>();
  const supabase = await createSupabaseServerClient();
  if (!supabase) return new Set<string>();
  const { data } = await supabase.from("likes").select("target_id").eq("user_id", userId).in("target_id", targetIds);
  return new Set((data ?? []).map((r: { target_id: string }) => r.target_id));
}

export async function listUserQuestions(userId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("questions")
    .select("id, title, created_at, answers_count, is_hidden")
    .eq("author_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  return (data ?? []) as { id: string; title: string; created_at: string; answers_count: number; is_hidden: boolean }[];
}

export async function getComments(answerIds: string[]) {
  const map = new Map<string, import("@/types/community").Comment[]>();
  const ids = answerIds.filter((id) => !id.startsWith("demo-"));
  if (!ids.length) return map;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return map;
  const { data } = await supabase
    .from("comments")
    .select("id, answer_id, author_id, body, created_at, author:profiles!comments_author_id_fkey(username, avatar_url)")
    .in("answer_id", ids)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true })
    .returns<import("@/types/community").Comment[]>();
  for (const c of data ?? []) map.set(c.answer_id, [...(map.get(c.answer_id) ?? []), c]);
  return map;
}
