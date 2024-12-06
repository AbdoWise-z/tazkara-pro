"use client";

import {Flame, LandPlot, SquareKanban,} from "lucide-react"

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


export function NavExplore() {
  const { user } = useUser();
  const router = useRouter();

  // const modal = useModal();
  const Actions: HeaderAction[] = [
    {
      name: "Matches",
      icon: Flame,
      func: null,
      url: "/match",
    },
  ]

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Explore</SidebarGroupLabel>
      <SidebarMenu>
        {Actions.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
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
