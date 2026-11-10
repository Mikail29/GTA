import Image from "next/image";
import { cn } from "@/lib/utils/cn";

const palette = ["from-pink to-violet", "from-teal to-violet", "from-sunset to-pink", "from-violet to-teal"];

/** Nur Bilder aus dem eigenen Supabase-Speicher anzeigen (Schutz vor fremden URLs). */
function isTrustedAvatar(url: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(base && url.startsWith(`${base.replace(/\/$/, "")}/storage/v1/object/public/avatars/`));
}

export function Avatar({ name, url, size = 40, className }: { name: string; url: string | null; size?: number; className?: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const color = palette[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % palette.length];
  if (url && isTrustedAvatar(url)) {
    return <Image src={url} alt={`Profilbild von ${name}`} width={size} height={size} className={cn("shrink-0 rounded-full object-cover", className)} style={{ width: size, height: size }} />;
  }
  return (
    <span
      aria-hidden="true"
      className={cn("grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold text-night", color, className)}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  );
}
