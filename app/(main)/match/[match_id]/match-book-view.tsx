"use client";

import React from 'react';
import {usePolling} from "@/hooks/use-polling";
import {MatchWithStadiumWithReservations} from "@/app/(main)/match/[match_id]/types";
import InteractiveMatchPage from "@/app/(main)/match/[match_id]/interactive-match-page";
import {Loader} from "lucide-react";

const MatchBookView = (
  {
    match_id
  } : {
    match_id: string;
  }
) => {
  const data = usePolling({
    enabled: true,
    endpoint: `/api/match/${match_id}`,
    interval: 100,
    queryKey: [match_id],
  });

  const match_data = (data.data?.pages[0] as never) as MatchWithStadiumWithReservations;

  if (!match_data) {
    return (
      <div className="flex flex-col content-center items-center w-full h-full justify-center">
        <Loader className={"w-6 h-6 animate-spin justify-center"}/>
        Loading ..
      </div>
    );
  }
  return (
    <div className="flex flex-col content-center items-center w-full justify-center">
      <InteractiveMatchPage match={match_data}/>
    </div>
  )
  ;
};

export default MatchBookView;