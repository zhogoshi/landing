"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GeometricShapes01Icon, Layout01Icon } from "@hugeicons-pro/core-solid-rounded";
import { Logo, NavbarItem, NavbarMenu, NavbarMenuLink, NavbarMenus, ThemeToggle, TopBar } from "@hogoshi/ui";
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
          </NavbarMenu>
        </NavbarMenus>
        <ThemeToggle className="ml-auto" />
      </TopBar>
      <main>{children}</main>
    </>
  );
}
