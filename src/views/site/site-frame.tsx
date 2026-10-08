"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, Navbar, NavbarItem, ThemeToggle } from "@hogoshi/ui";
import type { ReactNode } from "react";
import { Cursor } from "./cursor";

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const apply = () => setNarrow(window.scrollY > 24);
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    return () => window.removeEventListener("scroll", apply);
  }, []);

  return (
    <>
      <Cursor />
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-sticky)] flex justify-center">
        <div
          className={`pointer-events-auto flex items-center transition-[width,height,margin,border-radius,background-color,border-color,box-shadow] duration-500 ease-[var(--motion-ease)] motion-reduce:transition-none ${
            narrow
              ? "border-border bg-bg-elevated mt-[calc(var(--safe-top)+0.75rem)] h-12 w-[min(40rem,calc(100%-max(1.5rem,var(--safe-left))-max(1.5rem,var(--safe-right))))] rounded-full border px-2 shadow-[var(--shadow-md)]"
              : "mt-[calc(var(--safe-top)+0.625rem)] h-14 w-full border border-transparent bg-transparent px-[max(0.75rem,var(--safe-left))] pr-[max(0.75rem,var(--safe-right))]"
          }`}
        >
          <Navbar className="relative h-full w-full bg-transparent px-1 shadow-none backdrop-blur-none">
            <NavbarItem
              render={<Link href="/" />}
              aria-label="hogoshi"
              className="hover:bg-transparent"
            >
              <Logo size="sm" variant="ghost" />
            </NavbarItem>
            <NavbarItem render={<Link href="/" />} active={pathname === "/"}>
              Home
            </NavbarItem>
            <NavbarItem render={<a href="https://template.hogoshi.dev" />}>Template</NavbarItem>
            <NavbarItem render={<a href="https://storybook.hogoshi.dev" />}>Storybook</NavbarItem>
            <ThemeToggle className="ml-auto" />
          </Navbar>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}
