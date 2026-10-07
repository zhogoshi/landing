import { HeroMark } from "./hero-mark";
import { HeroTitle } from "./hero-title";

export function HomePage() {
  return (
    <section className="mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 pt-24 pb-16 text-center md:grid md:grid-cols-2 md:items-center md:gap-8 md:px-10 md:text-left">
      <div className="grid justify-items-center gap-4 md:justify-items-start">
        <p className="text-fg-subtle text-[11px] tracking-[0.18em] uppercase">hogoshi</p>
        <HeroTitle />
      </div>
      <HeroMark />
      <p className="hogoshi-shimmer fixed bottom-[max(1.75rem,var(--safe-bottom))] left-1/2 -translate-x-1/2 text-sm font-medium">
        Something huge is next
      </p>
    </section>
  );
}
