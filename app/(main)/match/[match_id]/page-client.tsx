"use client";

import React from 'react';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import MatchBookView from "@/app/(main)/match/[match_id]/match-book-view";

const PageClient = (
  {match_id}: {match_id: string}
) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <MatchBookView match_id={match_id}/>
    </QueryClientProvider>
  );
};

export default PageClient;