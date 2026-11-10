"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Honeypot, inputClass } from "@/components/forms/field";
import { communityCategories } from "@/data/categories";
import { questionSchema, type QuestionInput } from "@/lib/validations/community";
import { createQuestionAction, updateQuestionAction } from "@/lib/community/actions";

export function QuestionForm({ initial, questionId }: { initial?: Partial<QuestionInput>; questionId?: string }) {
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
      const res = questionId ? await updateQuestionAction(questionId, values) : await createQuestionAction(values);
      // Bei Erfolg leitet die Server Action weiter; hier landen nur Fehler
      if (res) {
        setResult(res);
        for (const [k, v] of Object.entries(res.fieldErrors ?? {})) setError(k as keyof QuestionInput, { message: v });
      }
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative grid gap-5" noValidate>
      <Field label="Titel deiner Frage" htmlFor="title" error={errors.title?.message} hint="Kurz und konkret, z. B. „Welche Einstellungen helfen bei Ruckeln?“">
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
      <Field label="Beschreibung" htmlFor="body" error={errors.body?.message} hint={`${bodyLength}/5000 Zeichen · Bitte Spoiler im Text kenntlich machen.`}>
        <textarea id="body" rows={8} {...register("body")} maxLength={5000} aria-invalid={!!errors.body} className={inputClass} />
      </Field>
      <Honeypot {...register("website")} />
      <FormMessage result={result} />
      <div>
        <Button type="submit" disabled={pending} size="lg">
          {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
          {questionId ? "Änderungen speichern" : "Frage veröffentlichen"}
        </Button>
      </div>
    </form>
  );
}
