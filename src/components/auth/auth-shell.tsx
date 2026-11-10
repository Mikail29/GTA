import { Container } from "@/components/ui/container";
import { LogoMark } from "@/components/layout/logo";

export function AuthShell({ title, text, children, footer }: { title: string; text?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-0 size-[30rem] rounded-full bg-pink/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 size-[30rem] rounded-full bg-teal/10 blur-3xl" />
      <Container className="relative flex justify-center py-14 sm:py-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <LogoMark className="mx-auto mb-4 size-12" />
            <h1 className="text-3xl font-bold">{title}</h1>
            {text && <p className="mt-2 text-muted">{text}</p>}
          </div>
          <div className="surface p-6 sm:p-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
      </Container>
    </div>
  );
}
