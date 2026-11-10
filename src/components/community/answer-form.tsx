"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Honeypot, inputClass } from "@/components/forms/field";
import { answerSchema, type AnswerInput } from "@/lib/validations/community";
import { createAnswerAction } from "@/lib/community/actions";

export function AnswerForm({ questionId }: { questionId: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerInput>({ resolver: zodResolver(answerSchema), defaultValues: { questionId, body: "", website: "" } });

  const onSubmit = (values: AnswerInput) =>
    startTransition(async () => {
      const res = await createAnswerAction(values);
      setResult(res);
      if (res.ok) reset({ questionId, body: "", website: "" });
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative grid gap-4" noValidate>
      <input type="hidden" {...register("questionId")} />
      <Field label="Deine Antwort" htmlFor="answer-body" error={errors.body?.message} hint="Sachlich, hilfreich und ohne unmarkierte Spoiler. Max. 5000 Zeichen.">
        <textarea id="answer-body" rows={5} maxLength={5000} {...register("body")} aria-invalid={!!errors.body} className={inputClass} />
      </Field>
      <Honeypot {...register("website")} />
      <FormMessage result={result} />
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />} Antwort senden
        </Button>
      </div>
    </form>
  );
}
