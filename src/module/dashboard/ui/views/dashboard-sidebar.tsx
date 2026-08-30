"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade Plan",
    href: "/upgrade",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-purple-500/15 bg-[#0a0314]/90 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex items-center justify-center size-10 rounded-xl bg-gradient-to-tr from-[#7B2CBF] to-[#F77F00] p-[1px] shadow-lg shadow-purple-500/20">
            <div className="size-full bg-[#0d041a] rounded-[11px] flex items-center justify-center">
              <Image src="/logo.svg" alt="Convo Cortex" width={24} height={24} className="rounded-full" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
            Convo-Cortex
          </span>
        </Link>
      </SidebarHeader>

      <div className="px-4 py-1">
        <Separator className="bg-purple-500/10" />
      </div>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {firstSection.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10 rounded-xl px-3.5 text-sm font-medium transition-all text-purple-200/70 hover:text-white hover:bg-white/[0.05]",
                        isActive &&
                          "bg-gradient-to-r from-[#7B2CBF]/30 via-[#9D4EDD]/15 to-transparent border border-purple-500/30 text-white shadow-[0_0_20px_-5px_rgba(147,51,234,0.3)]"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className={cn("size-4.5", isActive ? "text-[#F77F00]" : "text-purple-300/60")} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-1">
          <Separator className="bg-purple-500/10" />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {secondSection.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10 rounded-xl px-3.5 text-sm font-medium transition-all text-purple-200/70 hover:text-white hover:bg-white/[0.05]",
                        isActive &&
                          "bg-gradient-to-r from-[#7B2CBF]/30 via-[#9D4EDD]/15 to-transparent border border-purple-500/30 text-white shadow-[0_0_20px_-5px_rgba(147,51,234,0.3)]"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className={cn("size-4.5", isActive ? "text-[#F77F00]" : "text-purple-300/60")} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};