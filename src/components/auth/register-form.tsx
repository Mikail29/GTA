"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, Honeypot, inputClass } from "@/components/forms/field";
import { PasswordInput } from "./password-input";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { signUpAction } from "@/lib/auth/actions";

export function RegisterForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), defaultValues: { acceptRules: false, website: "" } });

  if (result?.ok) {
    return (
      <div className="grid justify-items-center gap-3 text-center" role="status">
        <MailCheck className="size-12 text-teal" aria-hidden="true" />
        <p className="font-semibold">Bitte bestätige deine E-Mail-Adresse</p>
        <p className="text-sm text-muted">{result.message}</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="relative grid gap-5"
      onSubmit={handleSubmit((values) =>
        startTransition(async () => {
          const res = await signUpAction(values);
          setResult(res);
          for (const [k, v] of Object.entries(res.fieldErrors ?? {})) setError(k as keyof RegisterInput, { message: v });
        }),
      )}
    >
      <Field label="Benutzername" htmlFor="username" error={errors.username?.message} hint="3–24 Zeichen: Buchstaben, Zahlen, _ und -. Öffentlich sichtbar.">
        <input id="username" autoComplete="username" {...register("username")} aria-invalid={!!errors.username} className={inputClass} />
      </Field>
      <Field label="E-Mail-Adresse" htmlFor="email" error={errors.email?.message} hint="Wird nicht öffentlich angezeigt.">
        <input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} className={inputClass} />
      </Field>
      <Field label="Passwort" htmlFor="password" error={errors.password?.message} hint="Mindestens 10 Zeichen, mit Buchstaben und Zahlen.">
        <PasswordInput id="password" autoComplete="new-password" {...register("password")} aria-invalid={!!errors.password} />
      </Field>
      <Field label="Passwort wiederholen" htmlFor="passwordConfirm" error={errors.passwordConfirm?.message}>
        <PasswordInput id="passwordConfirm" autoComplete="new-password" {...register("passwordConfirm")} aria-invalid={!!errors.passwordConfirm} />
      </Field>
      <div>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" {...register("acceptRules")} className="mt-1 size-4 accent-pink" aria-invalid={!!errors.acceptRules} />
          <span>
            Ich bin mindestens 18 Jahre alt und akzeptiere die{" "}
            <Link href="/nutzungsbedingungen" className="text-teal underline" target="_blank">
              Nutzungsbedingungen
            </Link>{" "}
            und{" "}
            <Link href="/community-regeln" className="text-teal underline" target="_blank">
              Community-Regeln
            </Link>
            . Die{" "}
            <Link href="/datenschutz" className="text-teal underline" target="_blank">
              Datenschutzerklärung
            </Link>{" "}
            habe ich gelesen.
          </span>
        </label>
        {errors.acceptRules && (
          <p className="mt-1 text-xs text-danger" role="alert">
            {errors.acceptRules.message}
          </p>
        )}
      </div>
      <Honeypot {...register("website")} />
      <FormMessage result={result} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <UserPlus className="size-5" aria-hidden="true" />} Konto erstellen
      </Button>
    </form>
  );
}
