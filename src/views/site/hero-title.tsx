"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const words = ["faster", "smarter", "better", "sharper"];

export function HeroTitle() {
  const probe = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<string | null>(null);
  const [widths, setWidths] = useState<number[]>([]);

  useLayoutEffect(() => {
    const node = probe.current;
    if (!node) return;
    const read = () => {
      const canvas = document.createElement("canvas").getContext("2d");
      if (!canvas) return;
      const style = getComputedStyle(node);
      canvas.font = style.font;
      const pad = (parseFloat(style.fontSize) || 16) * 0.35;
      setWidths(
        words.map((word) => {
          const metrics = canvas.measureText(word);
          const right = Math.max(metrics.width, metrics.actualBoundingBoxRight || 0);
          return Math.ceil(right + pad);
        }),
      );
    };
    read();
    void document.fonts?.ready.then(read);
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  useEffect(() => {
    let timer = 0;
    const cycle = () => {
      if (document.documentElement.hasAttribute("data-theme-switching")) {
        timer = window.setTimeout(cycle, 200);
        return;
      }
      const next = (indexRef.current + 1) % words.length;
      setPrevious(words[indexRef.current] ?? null);
      indexRef.current = next;
      setIndex(next);
      timer = window.setTimeout(cycle, 2400);
    };
    timer = window.setTimeout(cycle, 1600);
    return () => window.clearTimeout(timer);
  }, []);

  const current = words[index] ?? words[0];
  const width = widths[index];

  return (
    <h1 className="text-fg inline-flex w-fit items-baseline text-4xl leading-none font-semibold tracking-tight whitespace-nowrap sm:text-5xl md:text-7xl">
      <span ref={probe} aria-hidden className="pointer-events-none absolute font-extralight italic opacity-0" />
      I&apos;m
      <span
        className="relative ml-[0.28em] inline-block overflow-visible pr-[0.28em] text-left align-baseline transition-[width] duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ width: width ? `${width}px` : undefined }}
      >
        <span className="invisible font-extralight italic" aria-hidden>
          {current}
        </span>
        {previous ? (
          <span key={previous} className="hogoshi-word hogoshi-word-out" onAnimationEnd={() => setPrevious(null)}>
            {previous}
          </span>
        ) : null}
        <span key={current} className="hogoshi-word hogoshi-word-in">
          {current}
        </span>
      </span>
    </h1>
  );
}
