"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, Mail } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { Field, FormMessage, inputClass } from "@/components/forms/field";
import { PasswordInput } from "./password-input";
import { forgotPasswordSchema, resetPasswordSchema, type ForgotPasswordInput, type ResetPasswordInput } from "@/lib/validations/auth";
import { forgotPasswordAction, resetPasswordAction } from "@/lib/auth/actions";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  return (
    <form noValidate className="grid gap-5" onSubmit={handleSubmit((v) => startTransition(async () => setResult(await forgotPasswordAction(v))))}>
      <Field label="E-Mail-Adresse" htmlFor="email" error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} className={inputClass} />
      </Field>
      <FormMessage result={result} />
      <Button type="submit" size="lg" disabled={pending || result?.ok}>
        {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Mail className="size-5" aria-hidden="true" />} Link anfordern
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  if (result?.ok) {
    return (
      <div className="grid gap-4" role="status">
        <FormMessage result={result} />
        <LinkButton href="/profil">Zum Profil</LinkButton>
      </div>
    );
  }

  return (
    <form noValidate className="grid gap-5" onSubmit={handleSubmit((v) => startTransition(async () => setResult(await resetPasswordAction(v))))}>
      <Field label="Neues Passwort" htmlFor="password" error={errors.password?.message} hint="Mindestens 10 Zeichen, mit Buchstaben und Zahlen.">
        <PasswordInput id="password" autoComplete="new-password" {...register("password")} aria-invalid={!!errors.password} />
      </Field>
      <Field label="Neues Passwort wiederholen" htmlFor="passwordConfirm" error={errors.passwordConfirm?.message}>
        <PasswordInput id="passwordConfirm" autoComplete="new-password" {...register("passwordConfirm")} aria-invalid={!!errors.passwordConfirm} />
      </Field>
      <FormMessage result={result} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <KeyRound className="size-5" aria-hidden="true" />} Passwort speichern
      </Button>
    </form>
  );
}
