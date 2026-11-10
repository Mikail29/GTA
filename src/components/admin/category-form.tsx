"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage, inputClass } from "@/components/forms/field";
import { createCategoryAction } from "@/lib/admin/actions";

export function CategoryForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        startTransition(async () => {
          const res = await createCategoryAction({ slug: String(fd.get("slug")), name: String(fd.get("name")), section: String(fd.get("section")) });
          setResult(res);
          if (res.ok) form.reset();
        });
      }}
    >
      <label className="grid gap-1 text-sm">
        Name
        <input name="name" required maxLength={60} className={inputClass} />
      </label>
      <label className="grid gap-1 text-sm">
        Slug
        <input name="slug" required pattern="[a-z0-9-]{2,40}" maxLength={40} className={inputClass} />
      </label>
      <label className="grid gap-1 text-sm">
        Bereich
        <select name="section" className={inputClass}>
          <option value="artikel">Artikel</option>
          <option value="missionen">Missionen</option>
          <option value="geheimnisse">Geheimnisse</option>
          <option value="community">Community</option>
        </select>
      </label>
      <Button type="submit" disabled={pending}>
        <Plus className="size-4" aria-hidden="true" /> Anlegen
      </Button>
      <div className="sm:col-span-4">
        <FormMessage result={result} />
      </div>
    </form>
  );
}
