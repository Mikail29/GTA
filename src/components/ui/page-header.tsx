import { Container } from "./container";
import { Breadcrumbs, type Crumb } from "@/components/navigation/breadcrumbs";

export function PageHeader({ title, text, eyebrow, crumbs, children }: { title: string; text?: string; eyebrow?: string; crumbs?: Crumb[]; children?: React.ReactNode }) {
  return (
    <header className="relative overflow-hidden border-b border-line/60">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] size-[28rem] rounded-full bg-pink/15 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 left-[-10%] size-[22rem] rounded-full bg-violet/15 blur-3xl" />
      <Container className="relative py-10 sm:py-14">
        {crumbs && <Breadcrumbs items={crumbs} />}
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal">{eyebrow}</p>}
        <h1 className="text-3xl font-bold sm:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{text}</p>}
        {children && <div className="mt-6">{children}</div>}
      </Container>
    </header>
  );
}
