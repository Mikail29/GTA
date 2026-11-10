import { Notice } from "@/components/ui/notice";
import type { ContentBlock } from "@/types/content";

/** Rendert strukturierte Inhaltsblöcke. Kein HTML aus Daten → kein XSS. */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose-kompass">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={b.id}>
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id}>
                {b.text}
              </h3>
            );
          case "p":
            return <p key={i}>{b.text}</p>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            );
          case "note":
            return (
              <Notice key={i} tone={b.tone} title={b.title} className="my-6 not-prose">
                {b.text}
              </Notice>
            );
        }
      })}
    </div>
  );
}

export function tocFromBlocks(blocks: ContentBlock[]) {
  return blocks.filter((b): b is Extract<ContentBlock, { type: "h2" | "h3" }> => b.type === "h2" || b.type === "h3").map((b) => ({ id: b.id, text: b.text, level: b.type === "h2" ? 2 : 3 }));
}
