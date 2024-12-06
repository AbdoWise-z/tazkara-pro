import * as React from "react"
import {
  AlbumIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav/nav-main"
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
import {db} from "@/lib/db";

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUserProfile(false);

  const reservations = user != null ? await db.reservation.findMany({
    where: {
      userId: user.id,
    },
    include: {
      match: true,
    }
  }) : [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[
          {
            enabled: user != null && user.firstName != null,
            title: "Reservations",
            url: "/reservations",
            icon: AlbumIcon,
            isActive: true,
            items: reservations.map(
              (i) => {
                return {
                  title: `${i.match.homeTeam} vs ${i.match.awayTeam}`,
                  url: `/match/${i.matchId}`
                }
              }
            )
          }
        ]} />
        <NavModActions />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
