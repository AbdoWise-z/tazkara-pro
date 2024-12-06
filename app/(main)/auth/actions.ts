"use server";


import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {Role} from "@prisma/client";

export async function getAuthRequests() {
  const user = await currentUserProfile();
  if (!user) {
    return {
      success: false,
      fatal: true,
      reason: "no user"
    }
  }

  if (user.Role != Role.Administrator) {
    return {
      success: false,
      fatal: true,
      reason: "no permission"
    }
  }

  const auth_req = await db.authorizationRequest.findMany({
    include: {
      user: true
    },
    take: 100
  }); // get 100

  return {
    success: true,
    data: auth_req
  }
}

export async function approveAuthRequest(id: string) {
  const user = await currentUserProfile();
  if (!user) {
    return {
      success: false,
      fatal: true,
      reason: "no user"
    }
  }

  if (user.Role != Role.Administrator) {
    return {
      success: false,
      fatal: true,
      reason: "no permission"
    }
  }

  const auth_req = await db.authorizationRequest.delete({
    where: {
      id: id
    },
  });

  if (auth_req) {
    const user = auth_req.userId;
    await db.user.update({
      where: {
        id: user,
      },
      data: {
        Role: Role.Manager
      }
    })

    return {
      success: true,
    }
  } else {
    return {
      success: false,
      fatal: false,
      reason: "no such request"
    }
  }
}


export async function rejectAuthRequest(id: string) {
  const user = await currentUserProfile();
  if (!user) {
    return {
      success: false,
      fatal: true,
      reason: "no user"
    }
  }

  if (user.Role != Role.Administrator) {
    return {
      success: false,
      fatal: true,
      reason: "no permission"
    }
  }

  const auth_req = await db.authorizationRequest.delete({
    where: {
      id: id
    },
  });

  if (auth_req) {
    return {
      success: true,
    }
  } else {
    return {
      success: false,
      fatal: false,
      reason: "no such request"
    }
  }
}


