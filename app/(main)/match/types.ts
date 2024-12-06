import {Match, Stadium} from "@prisma/client";

export type MatchWReservationsCountWStadium = Match & {
  reservations: number,
  maxReservations: number,
  stadium: Stadium;
}
