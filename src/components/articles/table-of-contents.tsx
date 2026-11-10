import { ListOrdered } from "lucide-react";

export function TableOfContents({ items }: { items: { id: string; text: string; level: number }[] }) {
  if (items.length < 2) return null;
  return (
    <nav aria-labelledby="toc-title" className="surface p-5">
      <p id="toc-title" className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <ListOrdered className="size-4 text-teal" aria-hidden="true" /> Inhaltsverzeichnis
      </p>
      <ol className="grid gap-1.5 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-4" : undefined}>
            <a href={`#${item.id}`} className="block rounded-lg px-2 py-1 text-muted transition hover:bg-white/5 hover:text-white">
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
