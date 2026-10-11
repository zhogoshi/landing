"use client";

import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const lag = useRef({ x: 0, y: 0 });
  const armed = useRef(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    document.documentElement.classList.add("hogoshi-cursor");
    const move = (event: MouseEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY };
      if (!armed.current) {
        armed.current = true;
        lag.current = { ...mouse.current };
        setShown(true);
      }
      if (dot.current) dot.current.style.transform = `translate3d(${event.clientX - 1}px, ${event.clientY - 1}px, 0)`;
    };
    let frame = 0;
    const loop = () => {
      const grow = document.querySelector("[data-cursor='grow']:hover") ? 1.8 : 1;
      lag.current.x += (mouse.current.x - lag.current.x) * 0.12;
      lag.current.y += (mouse.current.y - lag.current.y) * 0.12;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${lag.current.x - 12}px, ${lag.current.y - 12}px, 0) scale(${grow})`;
      }
      frame = requestAnimationFrame(loop);
    };
    const pin = () => {
      const layer = document.querySelector(".hogoshi-theme-layer");
      if (!layer) return;
      layer.querySelectorAll(".hogoshi-socials, .hogoshi-cursor-layer").forEach((node) => node.remove());
      const socials = document.querySelector(".hogoshi-socials");
      const chrome = document.querySelector(".hogoshi-cursor-layer");
      if (socials) document.body.appendChild(socials);
      if (chrome) document.body.appendChild(chrome);
    };
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      if (root.hasAttribute("data-theme-switching")) pin();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme-switching"] });
    window.addEventListener("mousemove", move);
    frame = requestAnimationFrame(loop);
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("hogoshi-cursor");
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="hogoshi-cursor-layer pointer-events-none fixed inset-0 z-[2147483647]">
      <div
        ref={ring}
        className={`pointer-events-none fixed top-0 left-0 hidden size-6 rounded-full border border-white mix-blend-difference [@media(pointer:fine)]:block ${shown ? "" : "opacity-0"}`}
      />
      <div
        ref={dot}
        className={`pointer-events-none fixed top-0 left-0 hidden size-0.5 rounded-full bg-white mix-blend-difference [@media(pointer:fine)]:block ${shown ? "" : "opacity-0"}`}
      />
    </div>
  );
}
