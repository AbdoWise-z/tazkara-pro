import * as React from "react"
import {
  AlbumIcon,
} from "lucide-react"

import { NavAccount } from "@/components/nav/nav-account"
import { NavModActions } from "@/components/nav/nav-mod-actions"
import { NavUser } from "@/components/nav/nav-user"
import { NavHeader } from "@/components/nav/nav-header"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {currentUserProfile} from "@/lib/user-profile";
import {getMatchesWithReservations} from "@/app/(main)/tickets/actions";
import {NavExplore} from "@/components/nav/nav-explore";
import {NavAdminActions} from "@/components/nav/nav-admin-actions";

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUserProfile(false);

  const rev = await getMatchesWithReservations();
  if (!rev) {
    return "well this is weird";
  }

  const reservations = rev.data!;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader/>
      </SidebarHeader>
      <SidebarContent>
        <NavExplore />
        <NavAccount items={[
          {
            enabled: user != null && user.firstName != null,
            title: "Reservations",
            url: "/tickets",
            icon: AlbumIcon,
            isActive: true,
            items: reservations.map(
              (i) => {
                return {
                  title: `${i.homeTeam} vs ${i.awayTeam}`,
                  url: `/tickets`,
                  id: `${i.id}`
                }
              }
            )
          }
        ]} />
        <NavModActions />
        <NavAdminActions />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
