"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, NavbarItem, ThemeToggle, TopBar } from "@hogoshi/ui";
import type { ReactNode } from "react";
import { Cursor } from "./cursor";

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Cursor />
      <TopBar>
        <NavbarItem render={<Link href="/" />} aria-label="hogoshi" className="hover:bg-transparent">
          <Logo size="sm" variant="ghost" />
        </NavbarItem>
        <NavbarItem render={<Link href="/" />} active={pathname === "/"}>
          Home
        </NavbarItem>
        <NavbarItem render={<a href="https://template.hogoshi.dev" />}>Template</NavbarItem>
        <NavbarItem render={<a href="https://storybook.hogoshi.dev" />}>Storybook</NavbarItem>
        <ThemeToggle className="ml-auto" />
      </TopBar>
      <main>{children}</main>
    </>
  );
}
