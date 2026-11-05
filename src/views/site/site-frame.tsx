"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CodeIcon, GeometricShapes01Icon, GithubIcon, JobSearchIcon, Layers01Icon, Layout01Icon } from "@hugeicons-pro/core-solid-rounded";
import { Icon, Logo, NavbarItem, NavbarMenu, NavbarMenuLink, NavbarMenus, ThemeToggle, Tooltip, TooltipContent, TooltipTrigger, TopBar, type AppIcon } from "@hogoshi/ui";
import type { ReactNode } from "react";
import products from "../../../content/products.json";
import { Cursor } from "./cursor";

const projectIcons: Record<string, AppIcon> = {
  template: Layout01Icon,
  storybook: GeometricShapes01Icon,
  hrocket: JobSearchIcon,
  ui: Layers01Icon,
  obfuscator: CodeIcon,
};

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
            {products.map((product) => (
              <div key={product.id} className="hover:bg-bg-subtle flex items-center rounded-[var(--radius-md)] pr-1">
                <NavbarMenuLink
                  href={product.href}
                  icon={projectIcons[product.id]}
                  title={product.name}
                  description={product.description}
                  className="min-w-0 flex-1 hover:bg-transparent"
                />
                <Tooltip>
                  <TooltipTrigger
                    delay={0}
                    render={<a href={product.repo} target="_blank" rel="noreferrer" />}
                    aria-label="Repo"
                    className="text-fg-muted hover:bg-bg-muted hover:text-fg grid size-8 shrink-0 cursor-pointer place-items-center rounded-[var(--radius-sm)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon icon={GithubIcon} size={16} />
                  </TooltipTrigger>
                  <TooltipContent side="top">Repo</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </NavbarMenu>
        </NavbarMenus>
        <ThemeToggle className="ml-auto" />
      </TopBar>
      <main>{children}</main>
    </>
  );
}
