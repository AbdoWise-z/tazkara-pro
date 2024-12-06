import React from 'react';
import {currentUserProfile} from "@/lib/user-profile";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import PageClient from "@/app/(main)/match/[match_id]/page-client";

const Page = async (
  {params} : {
    params: Promise<{
      match_id: string;
    }>
  }
) => {

  const match_id = (await params).match_id;
  const user = await currentUserProfile(true);
  const match = await db.match.findUnique({
    where: {
      id: match_id,
    }
  })

  if (!match) {
    return redirect("/");
  }

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
                <BreadcrumbLink href="/match">
                  Matches
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block"/>
              <BreadcrumbItem>
                <BreadcrumbPage>{`${match.homeTeam} vs ${match.awayTeam}`}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <PageClient match_id={match_id}/>
      </div>
    </>
  )
};

export default Page;