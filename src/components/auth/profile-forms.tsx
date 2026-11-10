"use client";

import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormMessage, inputClass } from "@/components/forms/field";
import { Avatar } from "@/components/community/avatar";
import { profileSchema, type ProfileInput } from "@/lib/validations/auth";
import { updateProfileAction, uploadAvatarAction } from "@/lib/auth/actions";

export function ProfileForm({ initial }: { initial: { username: string; bio: string } }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), defaultValues: initial });

  return (
    <form
      noValidate
      className="grid gap-5"
      onSubmit={handleSubmit((v) =>
        startTransition(async () => {
          const res = await updateProfileAction(v);
          setResult(res);
          for (const [k, msg] of Object.entries(res.fieldErrors ?? {})) setError(k as keyof ProfileInput, { message: msg });
        }),
      )}
    >
      <Field label="Benutzername" htmlFor="username" error={errors.username?.message}>
        <input id="username" {...register("username")} aria-invalid={!!errors.username} className={inputClass} />
      </Field>
      <Field label="Über mich (optional)" htmlFor="bio" error={errors.bio?.message} hint="Max. 280 Zeichen, öffentlich sichtbar.">
        <textarea id="bio" rows={3} maxLength={280} {...register("bio")} className={inputClass} />
      </Field>
      <FormMessage result={result} />
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />} Speichern
        </Button>
      </div>
    </form>
  );
}

export function AvatarForm({ username, avatarUrl }: { username: string; avatarUrl: string | null }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="flex flex-col items-center gap-3 text-center"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(async () => setResult(await uploadAvatarAction(data)));
      }}
    >
      <Avatar name={username} url={avatarUrl} size={96} />
      <label htmlFor="avatar" className="sr-only">
        Profilbild auswählen
      </label>
      <input
        ref={inputRef}
        id="avatar"
        name="avatar"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="block w-full text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-card-hover file:px-3 file:py-1.5 file:text-white"
      />
      <p className="text-xs text-muted">PNG, JPG oder WebP, max. 2 MB.</p>
      <Button type="submit" size="sm" variant="secondary" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <ImageUp className="size-4" aria-hidden="true" />} Hochladen
      </Button>
      <FormMessage result={result} />
    </form>
  );
}
