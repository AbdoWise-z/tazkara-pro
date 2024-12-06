import {Match, Reservation, Stadium} from "@prisma/client";

export type MatchWithTickets = Match & {
  tickets: (Reservation )[],
  stadium: Stadium
}
