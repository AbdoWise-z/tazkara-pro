import {Match, Reservation, Stadium} from "@prisma/client";

export type MatchWithStadiumWithReservations = Match & {
  stadium: Stadium,
  Reservations: Reservation[],
}