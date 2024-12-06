import {AuthorizationRequest, Match, Reservation, Stadium, User} from "@prisma/client";

export type AuthorizationWithUser = AuthorizationRequest & {
  user: User;
}
