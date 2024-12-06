"use server"


import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";

export async function addReservation(matchId: string, row: number, column: number) {
  const user = await currentUserProfile();
  if (!user) {
    return {
      success: false,
      fatal: true,
      reason: "no user"
    }
  }

  // now check if the match exists
  const match = await db.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      stadium: true,
    }
  })

  if (!match) {
    return {
      success: false,
      fatal: true,
      reason: "no such match"
    }
  }

  const seat = row * match.stadium.columnCount + column
  // ok now check if that seat is empty
  const rev = await db.reservation.findFirst({
    where: {
      matchId: matchId,
      seatIndex: seat,
    }
  })

  if (!rev) {
    // ok its empty :)
    // try to book it
    try {
      await db.reservation.create({
        data: {
          userId: user.id,
          matchId: matchId,
          seatIndex: seat,
        }
      })

      return {
        success: true,
      }
    } catch (e) {
      console.log(e);
      return {
        success: false,
        fatal: false,
        reason: "someone else booked this"
      }
    }
  } else {
    if (rev.userId == user.id) {
      return {
        success: true,
      }
    } else {
      return {
        success: false,
        fatal: false,
        reason: "someone else booked this"
      }
    }
  }
}


export async function removeReservation(matchId: string, row: number, column: number) {
  const user = await currentUserProfile();
  if (!user) {
    return {
      success: false,
      fatal: true,
      reason: "no user"
    }
  }

  // now check if the match exists
  const match = await db.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      stadium: true,
    }
  })

  if (!match) {
    return {
      success: false,
      fatal: true,
      reason: "no such match"
    }
  }

  const seat = row * match.stadium.columnCount + column
  // ok now check if that seat is empty
  const rev = await db.reservation.deleteMany({
    where: {
      matchId: matchId,
      seatIndex: seat,
      userId: user.id
    }
  })


  if (rev.count == 0) {
    return {
      success: false,
      fatal: false,
      reason: "seat is empty our you dont own it"
    }
  } else {
    return {
      success: true,
      fatal: false,
      reason: "done :)"
    }
  }
}