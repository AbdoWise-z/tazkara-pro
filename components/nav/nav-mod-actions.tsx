"use client";

import {LandPlot, SquareKanban,} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {HeaderAction} from "@/components/nav/types";
import * as React from "react";
import {Button} from "@/components/ui/button";
import {useUser} from "@/components/providers/current-user-provider";
import {useRouter} from "next/navigation";


export function NavModActions() {
  const { user } = useUser();
  const hasPermission = user?.Role == "Manager" || user?.Role == "Administrator";
  const router = useRouter();

  // const modal = useModal();
  const Actions: HeaderAction[] = [
    {
      name: "Manage Stadiums",
      icon: LandPlot,
      func: null,
      url: "/stadiums",
    },
    {
      name: "Mange Matches",
      url: "/match",
      icon: SquareKanban,
      func: null,
    }
  ]

  if (!user) {
    return "";
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Mod Actions</SidebarGroupLabel>
      <SidebarMenu>
        {Actions.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild disabled={!hasPermission}>
              <Button variant={"ghost"} className={"justify-start"} onClick={
                () => {
                  if (item.url) {
                    router.push(item.url);
                  }
                  if (item.func) {
                    item.func();
                  }
                }
              }>
                <item.icon />
                <span>{item.name}</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
