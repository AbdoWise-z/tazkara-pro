"use client"

import {BadgeCheck, ChevronsUpDown, CreditCard, LogOut, Sparkles,} from "lucide-react"

import {Avatar, AvatarFallback,} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar"
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useUser} from "@/components/providers/current-user-provider";
import {ModalType, useModal} from "@/hooks/use-modal";
import {useClerk} from "@clerk/nextjs";
import {toast} from "sonner";
import {RequestMod} from "@/components/nav/actions";

export function NavUser() {
  const { openUserProfile, signOut } = useClerk();
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { user } = useUser();
  const modal = useModal();

  const handleModRequest = async () => {
    try {
      const result = await RequestMod();

      if (result.success) {
        toast("Your request has been sent!", {
          description: `Your request will be evaluated by an admin soon`,
          action: {
            label: "Lesgo",
            onClick: () => {},
          },
        })
      }

      if (!result.success) {
        toast("You already sent a request before.", {
          description: `Your request will be evaluated by an admin soon`,
          action: {
            label: "Ok",
            onClick: () => {},
          },
        })
      }
    } catch (error) {
      toast("Failed to request mod", {
        description: `Error: ${error}`,
        action: {
          label: "Retry",
          onClick: () => handleModRequest(),
        },
      })
    }
  }

  if (!user) {
    return (
      <Button
        className={"font-bold m-2"}
        size="default"
        onClick={() => {
          router.push("/sign-up")
        }}
      >
        Sign in
      </Button>
    );
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{user.firstName?.substr(0, Math.min(user.firstName?.length, 2))}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.firstName}</span>
                <span className="truncate text-xs">{user.lastName}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{user.firstName?.substr(0, Math.min(user.firstName?.length, 2))}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.firstName}</span>
                  <span className="truncate text-xs">{user.lastName}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled={user.Role != 'Fan'} onClick={() => handleModRequest()}>
                <Sparkles />
                Be a mod
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => {
                openUserProfile();
              }}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                modal.open(ModalType.EDIT_USER_INFO)
              }}>
                <CreditCard />
                User Info
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
