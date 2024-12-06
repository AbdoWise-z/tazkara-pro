"use client"

import * as React from "react"
import {ChevronsUpDown, Newspaper, TicketPercent, TicketPlus} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {useRouter} from "next/navigation";
import {HeaderAction} from "@/components/nav/types";



export function NavHeader() {
  const { isMobile } = useSidebar()
  const router = useRouter();

  const Actions: HeaderAction[] = [
    {
      name: "News",
      url: "/",
      icon: Newspaper,
      func: null,
    },
    {
      name: "Reserve a match",
      url: "/match",
      icon: TicketPlus,
      func: null,
    }
  ]

  return (

    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TicketPercent className="size-4 text-yellow-500" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {"Tazkara-Pro"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Explore
            </DropdownMenuLabel>
            {Actions.map((action, index) => (
              <DropdownMenuItem
                key={action.name}
                onClick={() => {
                  if (action.url) {
                    router.push(action.url);
                  }
                  if (action.func) {
                    action.func();
                  }
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <action.icon className="w-4 h-4"/>
                </div>
                {action.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
