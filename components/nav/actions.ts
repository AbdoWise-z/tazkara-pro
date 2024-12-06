"use server";

import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {Role} from "@prisma/client";

export async function RequestMod() {
  const user = await currentUserProfile();
  if (!user) {
    return {
      success: false,
      fatal: true,
      reason: "no user"
    }
  }

  if (user.Role != Role.Fan) {
    return {
      success: false,
      fatal: true,
      reason: "already a mod"
    }
  }

  try {
    await db.authorizationRequest.create({
      data: {
        userId: user.id,
      }
    });
    return {
      success: true,
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
      reason: "already requested"
    }
  }
}