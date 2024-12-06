import {Match, Reservation, Stadium, User} from "@prisma/client";

export type MatchWithTickets = Match & {
  tickets: (Reservation )[],
  stadium: Stadium
}
