"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, inputClass } from "@/components/forms/field";
import { PasswordInput } from "./password-input";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { signInAction } from "@/lib/auth/actions";

export function LoginForm({ next }: { next?: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  return (
    <form
      noValidate
      className="grid gap-5"
      onSubmit={handleSubmit((values) =>
        startTransition(async () => {
          const res = await signInAction(values, next);
          if (res) setResult(res);
        }),
      )}
    >
      <Field label="E-Mail-Adresse" htmlFor="email" error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} className={inputClass} />
      </Field>
      <Field label="Passwort" htmlFor="password" error={errors.password?.message}>
        <PasswordInput id="password" autoComplete="current-password" {...register("password")} aria-invalid={!!errors.password} />
      </Field>
      <div className="-mt-2 text-right">
        <Link href="/passwort-vergessen" className="text-sm text-teal hover:text-white">
          Passwort vergessen?
        </Link>
      </div>
      <FormMessage result={result} />
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <LogIn className="size-5" aria-hidden="true" />} Anmelden
      </Button>
    </form>
  );
}
