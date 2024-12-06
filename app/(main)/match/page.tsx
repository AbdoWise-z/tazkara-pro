import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList
} from "@/components/ui/breadcrumb";
import MatchesPage from "@/app/(main)/match/matches-page";

const Page = async () => {
  const user = await currentUserProfile(false);
  const isAdmin = user != null && user.Role != "Fan";


  return (
    <>
      <header
        className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1"/>
          <Separator orientation="vertical" className="mr-2 h-4"/>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Matches {isAdmin && (" (Admin)")}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <MatchesPage isAdmin={isAdmin} />
      </div>
    </>
  )
};

export default Page;