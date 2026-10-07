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
              ? "border-border bg-bg-elevated mt-3 h-12 w-[min(40rem,calc(100%-1.5rem))] rounded-full border px-2 shadow-[var(--shadow-md)]"
              : "mt-0 h-14 w-full border border-transparent bg-transparent px-3"
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
