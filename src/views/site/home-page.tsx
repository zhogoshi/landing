import { HeroMark } from "./hero-mark";
import { HeroTitle } from "./hero-title";
import { Socials } from "./socials";

export function HomePage() {
  return (
    <section className="mx-auto flex h-dvh max-h-dvh w-full max-w-6xl flex-col items-center justify-center gap-4 overflow-hidden pt-[calc(4.5rem+var(--safe-top))] pr-[max(1.5rem,var(--safe-right))] pb-[max(2.5rem,var(--safe-bottom))] pl-[max(1.5rem,var(--safe-left))] text-center md:grid md:grid-cols-2 md:items-center md:gap-6 md:pr-[max(2.5rem,var(--safe-right))] md:pl-[max(2.5rem,var(--safe-left))] md:text-left">
      <div className="grid justify-items-center gap-4 md:justify-items-start">
        <p className="text-fg-subtle text-[11px] tracking-[0.18em] uppercase">hogoshi</p>
        <HeroTitle />
      </div>
      <HeroMark />
      <Socials />
    </section>
  );
}
