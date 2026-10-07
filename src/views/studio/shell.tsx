"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartHistogramIcon, Folder01Icon, MailSend01Icon, ServerStack01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { Sidebar, SidebarHeader, SidebarInset, SidebarItem, SidebarNav, SidebarProvider, SidebarTrigger } from "@hogoshi/ui";
import type { ReactNode } from "react";

const modules = [
  { href: "pulse", label: "Pulse", icon: ChartHistogramIcon },
  { href: "services", label: "Services", icon: ServerStack01Icon },
  { href: "posts", label: "Posts", icon: Folder01Icon },
  { href: "deliveries", label: "Deliveries", icon: MailSend01Icon },
];

export function StudioShell({ base, children }: { base: string; children: ReactNode }) {
  const path = usePathname();
  return (
    <SidebarProvider>
      <div className="flex min-h-svh">
        <Sidebar>
          <SidebarHeader>
            <span className="text-sm font-semibold">Studio</span>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarNav>
            {modules.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                active={path.endsWith(`/${item.href}`) || path.includes(`/${item.href}/`)}
                render={<Link href={`/${base}/${item.href}`} />}
              >
                {item.label}
              </SidebarItem>
            ))}
          </SidebarNav>
        </Sidebar>
        <SidebarInset className="min-w-0 flex-1">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
