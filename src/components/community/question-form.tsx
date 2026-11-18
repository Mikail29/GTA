"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Megaphone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Honeypot, inputClass } from "@/components/forms/field";
import { communityCategories } from "@/data/categories";
import { questionSchema, type QuestionInput } from "@/lib/validations/community";
import { createQuestionAction, updateQuestionAction } from "@/lib/community/actions";

export function QuestionForm({ initial, questionId, kind = "frage" }: { initial?: Partial<QuestionInput>; questionId?: string; kind?: "frage" | "mitteilung" }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<QuestionInput>({
    resolver: zodResolver(questionSchema),
    defaultValues: { title: initial?.title ?? "", body: initial?.body ?? "", category: initial?.category ?? "", website: "" },
  });
  const bodyLength = useWatch({ control, name: "body" })?.length ?? 0;

  const onSubmit = (values: QuestionInput) =>
    startTransition(async () => {
      const res = questionId ? await updateQuestionAction(questionId, values) : await createQuestionAction({ ...values, kind });
      // Bei Erfolg leitet die Server Action weiter; hier landen nur Fehler
      if (res) {
        setResult(res);
        for (const [k, v] of Object.entries(res.fieldErrors ?? {})) setError(k as keyof QuestionInput, { message: v });
      }
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative grid gap-5" noValidate>
      <Field label={kind === "mitteilung" ? "Worum geht es?" : "Deine Frage"} htmlFor="title" error={errors.title?.message} hint={kind === "mitteilung" ? "Kurz und knapp, z. B. „Versteckter Ort am Strand gefunden“" : "Kurz und konkret, z. B. „Wo finde ich das erste Safehouse?“"}>
        <input id="title" {...register("title")} maxLength={140} aria-invalid={!!errors.title} className={inputClass} />
      </Field>
      <Field label="Kategorie" htmlFor="category" error={errors.category?.message}>
        <select id="category" {...register("category")} aria-invalid={!!errors.category} className={inputClass}>
          <option value="">Bitte auswählen…</option>
          {communityCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Beschreibung (optional)" htmlFor="body" error={errors.body?.message} hint={`${bodyLength}/5000 Zeichen · Bitte Spoiler im Text kenntlich machen.`}>
        <textarea id="body" rows={8} {...register("body")} maxLength={5000} aria-invalid={!!errors.body} className={inputClass} />
      </Field>
      <Honeypot {...register("website")} />
      <FormMessage result={result} />
      <div>
        <Button type="submit" disabled={pending} size="lg">
          {pending ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : kind === "mitteilung" && !questionId ? (
            <Megaphone className="size-5" aria-hidden="true" />
          ) : (
            <Send className="size-5" aria-hidden="true" />
          )}
          {questionId ? "Änderungen speichern" : kind === "mitteilung" ? "Mitteilung veröffentlichen" : "Frage veröffentlichen"}
        </Button>
      </div>
    </form>
  );
}
