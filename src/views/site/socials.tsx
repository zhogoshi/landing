"use client";

import { useEffect } from "react";
import { DiscordIcon, GithubIcon, Linkedin01Icon, TelegramIcon, VkIcon } from "@hugeicons-pro/core-solid-rounded";
import { Icon, Tooltip, TooltipContent, TooltipTrigger, toast, type AppIcon } from "@hogoshi/ui";

const links: { name: string; tip: string; href?: string; copy?: string; icon?: AppIcon; mark?: "steam" }[] = [
  { name: "Telegram", tip: "Telegram", href: "https://t.me/hogoshi", icon: TelegramIcon },
  { name: "Steam", tip: "Steam", href: "https://steamcommunity.com/id/hogoshi", mark: "steam" },
  { name: "Discord", tip: "Discord", copy: "hogoshi", icon: DiscordIcon },
  { name: "GitHub", tip: "GitHub", href: "https://github.com/zhogoshi", icon: GithubIcon },
  { name: "LinkedIn", tip: "LinkedIn", href: "https://www.linkedin.com/in/hogoshi", icon: Linkedin01Icon },
  { name: "VK", tip: "VK", href: "https://vk.com/hogoshi", icon: VkIcon },
];

function keepShimmer() {
  for (const animation of document.getAnimations()) {
    const effect = animation.effect;
    if (!effect || !("target" in effect)) continue;
    const target = effect.target;
    if (target instanceof Element && target.closest(".hogoshi-social")) animation.play();
  }
}

export function Socials() {
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      if (root.hasAttribute("data-theme-switching")) keepShimmer();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme-switching"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hogoshi-socials fixed bottom-[max(0.75rem,var(--safe-bottom))] left-1/2 z-[var(--z-sticky)] flex -translate-x-1/2 items-center gap-2.5">
      {links.map((link) => (
        <Tooltip key={link.name}>
          <TooltipTrigger
            delay={0}
            render={
              link.href ? (
                <a href={link.href} target="_blank" rel="noreferrer" />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(link.copy ?? "").then(() => toast.success("Copied"));
                  }}
                />
              )
            }
            aria-label={link.name}
            className="hogoshi-social"
          >
            {link.mark === "steam" || !link.icon ? <SteamMark /> : <Icon icon={link.icon} size={18} />}
          </TooltipTrigger>
          <TooltipContent side="top">{link.tip}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function SteamMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden className="fill-current">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
    </svg>
  );
}
