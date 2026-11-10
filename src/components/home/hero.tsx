import { ArrowRight, Search, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { HeroBackdrop } from "./hero-backdrop";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <HeroBackdrop />
      <Container className="relative flex min-h-[620px] flex-col items-center justify-center py-20 text-center sm:min-h-[700px]">
        <p className="mb-5 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-night/50 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
          <span className="size-2 animate-pulse-soft rounded-full bg-teal" aria-hidden="true" />
          Unabhängiges deutschsprachiges Fanportal
        </p>
        <h1 id="hero-title" className="animate-fade-up text-5xl font-bold leading-[1.05] drop-shadow-[0_4px_30px_rgb(16_15_32/0.6)] sm:text-7xl">
          Dein Kompass
          <br />
          durch <span className="text-gradient">GTA 6.</span>
        </h1>
        <p className="mt-6 max-w-2xl animate-fade-up text-base text-white/85 [animation-delay:100ms] sm:text-xl">
          Entdecke Tipps, Geheimnisse, Missionen und alles, was du über GTA 6 wissen möchtest.
        </p>

        <form action="/suche" role="search" className="mt-9 w-full max-w-2xl animate-fade-up [animation-delay:180ms]">
          <label htmlFor="hero-search" className="sr-only">
            GTA6-Kompass durchsuchen
          </label>
          <div className="group relative rounded-full bg-gradient-to-r from-sunset via-pink to-violet p-[1.5px] shadow-[0_20px_60px_-20px_rgb(255_85_184/0.6)]">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="hero-search"
              name="q"
              type="search"
              required
              maxLength={100}
              placeholder="Wonach suchst du?"
              className="h-14 w-full rounded-full bg-night/95 pl-13 pr-32 text-base text-white placeholder:text-muted/80 outline-none sm:h-16"
            />
            <button type="submit" className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink to-violet px-5 text-sm font-semibold text-white transition hover:brightness-110 sm:h-12 sm:px-6">
              Suchen
            </button>
          </div>
        </form>

        <div className="mt-7 flex w-full animate-fade-up flex-col justify-center gap-3 [animation-delay:240ms] sm:w-auto sm:flex-row">
          <LinkButton href="/tipps" size="lg">
            Tipps entdecken <ArrowRight className="size-5" aria-hidden="true" />
          </LinkButton>
          <LinkButton href="/community" variant="secondary" size="lg" className="bg-night/60 backdrop-blur">
            <Users className="size-5" aria-hidden="true" /> Community besuchen
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
