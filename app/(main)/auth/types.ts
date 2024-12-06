import {AuthorizationRequest, User} from "@prisma/client";

export type AuthorizationWithUser = AuthorizationRequest & {
  user: User;
}
