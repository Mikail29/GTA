"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, CircleAlert, Loader2, RotateCcw, Send, Settings2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { CHAT_MAX_MESSAGE_LENGTH } from "@/lib/validations/chat";

interface Message {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const examples = [
  "Wo finde ich bestimmte Gegenstände?",
  "Wie schaffe ich eine Mission?",
  "Welche Tipps gibt es für Anfänger?",
  "Welche Geheimnisse sind bereits bekannt?",
];

const STORAGE_KEY = "gta6k-chat-v1";

/** Wandelt interne Pfade (/tipps/…) in Links um. Alles andere bleibt reiner Text (kein HTML → kein XSS). */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\/(?:tipps|missionen|geheimnisse|news|karte|fragen|community)(?:\/[a-z0-9-]+)?)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\/(tipps|missionen|geheimnisse|news|karte|fragen|community)/.test(p) ? (
          <Link key={i} href={p} className="text-teal underline underline-offset-2">
            {p}
          </Link>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

export function ChatInterface({ configured }: { configured: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [restored, setRestored] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Gesprächsverlauf nur lokal in diesem Tab speichern (sessionStorage)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- einmalige Wiederherstellung aus dem Browser-Speicher
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.filter((m) => !m.error).slice(-30)));
    } catch {}
  }, [messages, restored]);

  useEffect(() => {
    if (messages.length === 0) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    if (content.length > CHAT_MAX_MESSAGE_LENGTH) return;

    const history = [...messages.filter((m) => !m.error), { role: "user" as const, content }];
    setMessages((m) => [...m, { role: "user", content }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ki", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.answer) {
        const msg = data?.error?.message ?? "Die Antwort konnte nicht geladen werden. Bitte versuche es erneut.";
        setMessages((m) => [...m, { role: "assistant", content: msg, error: true }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Keine Verbindung zum Server. Bitte prüfe deine Internetverbindung.", error: true }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const reset = () => {
    setMessages([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const remaining = CHAT_MAX_MESSAGE_LENGTH - input.length;

  return (
    <div className="surface flex h-[min(78dvh,760px)] min-h-[520px] flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="relative grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-teal to-violet text-night">
            <Bot className="size-5" aria-hidden="true" />
            <span className={cn("absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-card", configured ? "bg-success" : "bg-sunset")} aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold">GTA6-Kompass KI</p>
            <p className="text-xs text-muted">{configured ? "Online · antwortet auf Basis unserer Wissensdatenbank" : "Noch nicht eingerichtet"}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={reset} aria-label="Neues Gespräch starten">
            <RotateCcw className="size-4" aria-hidden="true" /> <span className="hidden sm:inline">Neues Gespräch</span>
          </Button>
        )}
      </div>

      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6" aria-live="polite" aria-busy={loading}>
        {!configured && (
          <div className="mx-auto max-w-xl rounded-2xl border border-sunset/30 bg-sunset/[0.07] p-5 text-sm">
            <p className="mb-1 flex items-center gap-2 font-semibold text-sunset">
              <Settings2 className="size-4" aria-hidden="true" /> KI-Verbindung noch nicht eingerichtet
            </p>
            <p className="text-muted">
              Die Chat-Oberfläche ist fertig, aber es ist noch kein KI-Anbieter verbunden. Betreiber können die Verbindung über die Umgebungsvariablen <code className="rounded bg-night px-1">AI_PROVIDER</code> und{" "}
              <code className="rounded bg-night px-1">ANTHROPIC_API_KEY</code> aktivieren (siehe README). Bis dahin helfen dir unsere{" "}
              <Link href="/tipps" className="text-teal underline">
                Ratgeber
              </Link>{" "}
              und die{" "}
              <Link href="/fragen" className="text-teal underline">
                Community
              </Link>
              .
            </p>
          </div>
        )}

        {messages.length === 0 && (
          <div className="mx-auto max-w-xl pt-4 text-center">
            <h2 className="text-xl font-bold">Wie kann ich dir helfen?</h2>
            <p className="mt-1 text-sm text-muted">Wähle eine Beispiel-Frage oder schreibe deine eigene.</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {examples.map((ex) => (
                <li key={ex}>
                  <button
                    type="button"
                    onClick={() => send(ex)}
                    disabled={loading}
                    className="h-full w-full rounded-2xl border border-line bg-night-2 px-4 py-3 text-left text-sm text-white transition hover:border-teal/50 hover:bg-card-hover disabled:opacity-50"
                  >
                    {ex}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}>
            <span className={cn("mt-1 grid size-8 shrink-0 place-items-center rounded-full", m.role === "user" ? "bg-pink/20 text-pink" : "bg-teal/15 text-teal")} aria-hidden="true">
              {m.role === "user" ? <UserRound className="size-4" /> : m.error ? <CircleAlert className="size-4 text-danger" /> : <Bot className="size-4" />}
            </span>
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
                m.role === "user" ? "rounded-tr-sm bg-gradient-to-br from-pink to-violet text-white" : m.error ? "rounded-tl-sm border border-danger/40 bg-danger/10 text-danger" : "rounded-tl-sm bg-night-2 text-white/90",
              )}
            >
              <span className="sr-only">{m.role === "user" ? "Du: " : "GTA6-Kompass KI: "}</span>
              {m.role === "assistant" && !m.error ? <RichText text={m.content} /> : m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <span className="mt-1 grid size-8 place-items-center rounded-full bg-teal/15 text-teal" aria-hidden="true">
              <Bot className="size-4" />
            </span>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-night-2 px-4 py-3 text-sm text-muted">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Antwort wird erstellt…
            </div>
          </div>
        )}
      </div>

      <form
        className="border-t border-line p-3 sm:p-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <div className="flex items-end gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Deine Frage
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, CHAT_MAX_MESSAGE_LENGTH))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            maxLength={CHAT_MAX_MESSAGE_LENGTH}
            placeholder="Stelle deine Frage zu GTA 6…"
            className="max-h-40 min-h-12 flex-1 resize-none rounded-2xl border border-line bg-night-2 px-4 py-3 text-sm outline-none transition focus:border-teal"
          />
          <Button type="submit" disabled={loading || !input.trim()} aria-label="Nachricht senden" className="size-12 shrink-0 px-0">
            {loading ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
          </Button>
        </div>
        <div className="mt-2 flex justify-between gap-2 px-1 text-[11px] text-muted">
          <span>Enter zum Senden · Shift+Enter für neue Zeile · Keine persönlichen Daten eingeben.</span>
          <span className={cn(remaining < 100 && "text-sunset")}>{remaining}</span>
        </div>
      </form>
    </div>
  );
}
