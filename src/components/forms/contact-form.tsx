"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, inputClass } from "./field";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";

/**
 * Datenschutzfreundliches Kontaktformular: Es speichert nichts auf dem Server,
 * sondern öffnet das E-Mail-Programm mit vorausgefüllter Nachricht.
 */
export function ContactForm({ email }: { email: string }) {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = (v: ContactInput) => {
    const body = `${v.message}\n\n— ${v.name}`;
    window.location.assign(`mailto:${email}?subject=${encodeURIComponent(`[5-Sterne-Kompass] ${v.subject}`)}&body=${encodeURIComponent(body)}`);
    setResult({ ok: true, message: "Dein E-Mail-Programm wurde geöffnet. Bitte sende die Nachricht dort ab." });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <Field label="Dein Name" htmlFor="name" error={errors.name?.message}>
        <input id="name" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} className={inputClass} />
      </Field>
      <Field label="Betreff" htmlFor="subject" error={errors.subject?.message}>
        <input id="subject" {...register("subject")} aria-invalid={!!errors.subject} className={inputClass} />
      </Field>
      <Field label="Nachricht" htmlFor="message" error={errors.message?.message}>
        <textarea id="message" rows={6} maxLength={3000} {...register("message")} aria-invalid={!!errors.message} className={inputClass} />
      </Field>
      <FormMessage result={result} />
      <div>
        <Button type="submit" size="lg">
          <Mail className="size-5" aria-hidden="true" /> E-Mail vorbereiten
        </Button>
      </div>
    </form>
  );
}
