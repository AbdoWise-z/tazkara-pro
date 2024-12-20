"use server";


import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {Role} from "@prisma/client";

export async function getUsersList(page: number) {
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

  const auth_req = await db.user.findMany({
    orderBy: {
      createdAt: 'asc',
    },
    take: 100,
    skip: page * 100
  }); // get 100

  return {
    success: true,
    data: auth_req
  }
}


export async function deleteUser(id: string) {
  console.log("delete 1")
  const user = await currentUserProfile();
  if (!user) {
    return {
      success: false,
      fatal: true,
      reason: "no user"
    }
  }

  console.log("delete 2")
  if (user.Role != Role.Administrator) {
    return {
      success: false,
      fatal: true,
      reason: "no permission"
    }
  }

  console.log("delete 3")
  const auth_req = await db.user.delete({
    where: {
      id: id
    },
  });

  console.log("delete 4 ", auth_req);
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


