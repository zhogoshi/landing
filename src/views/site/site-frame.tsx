"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GeometricShapes01Icon, Layout01Icon } from "@hugeicons-pro/core-solid-rounded";
import { Logo, NavbarItem, NavbarMenu, NavbarMenuLink, NavbarMenus, ThemeToggle, TopBar } from "@hogoshi/ui";
import type { ReactNode } from "react";
import { Cursor } from "./cursor";
import { EneruMark } from "./eneru-mark";

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
        <NavbarMenus>
          <NavbarMenu label="Projects">
            <NavbarMenuLink
              href="https://template.hogoshi.dev"
              icon={Layout01Icon}
              title="Template"
              description="A working dashboard. The example every new app starts from."
            />
            <NavbarMenuLink
              href="https://storybook.hogoshi.dev"
              icon={GeometricShapes01Icon}
              title="Storybook"
              description="The design system. Preview, controls, and a snippet for every component."
            />
            <a
              href="https://eneru.hogoshi.dev"
              className="text-fg hover:bg-bg-subtle flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm outline-none"
            >
              <span className="bg-bg-muted text-fg grid size-9 shrink-0 place-items-center rounded-[var(--radius-sm)]">
                <EneruMark className="size-5" />
              </span>
              <span className="grid min-w-0 gap-0.5">
                <span className="font-medium">Eneru</span>
                <span className="text-fg-muted text-xs leading-snug">
                  An absurd judge for porn-title ideas. It scores the bit, then gives the verdict.
                </span>
              </span>
            </a>
          </NavbarMenu>
        </NavbarMenus>
        <ThemeToggle className="ml-auto" />
      </TopBar>
      <main>{children}</main>
    </>
  );
}
