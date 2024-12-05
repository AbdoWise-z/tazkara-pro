import { db } from "@/lib/db";
import { currentUser, auth} from "@clerk/nextjs/server";
import {Role} from "@prisma/client";

export const currentUserProfile = async (redirect?: boolean) => {
  const user = await currentUser();

  if (!user) {
    if (redirect) {
      await auth.protect();
      return null;
    }
    return null;
  }

  const profile = await db.user.findFirst({
    where: {  
      clerk_id: user.id,
    }
  });

  if (profile) {
    return profile;
  }

  console.log("Creating user with ID: " + user.id);

  try {
    const newProfile = await db.user.create({
      data: {
        clerk_id: user.id,
        EmailAddress: user.emailAddresses[0].emailAddress,
        Role: Role.Fan,
      }
    })
    return newProfile;
  } catch (e){
    console.log(e);
    return (await db.user.findUnique({
      where: {
        clerk_id: user.id,
      }
    }));
  }
}