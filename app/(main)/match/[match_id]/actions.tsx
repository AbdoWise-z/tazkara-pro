"use server"


import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";

export async function addReservations(matchId: string, seats: number[]) {
  const user = await currentUserProfile();
  if (!user) {
    return {
      success: false,
      fatal: true,
      reason: "no user"
    }
  }

  const success: number[] = [];
  try {
    const result = await db.$transaction(async (tx) => {
      const revs = await tx.reservation.findMany({
        where: {
          userId: user.id,
          matchId: {
            notIn: [matchId],
          },
        },

        include: {
          match: true
        }
      });

      const match = await tx.match.findUnique({
        where: {
          id: matchId,
        }
      });

      if (!match) {
        return {
          success: false,
          fatal: true,
          reason: "no such match"
        }
      }


      const dateBefore3H = new Date(match.date);
      dateBefore3H.setHours(dateBefore3H.getHours() - 3);
      const dateAfter3H = new Date(match.date);
      dateAfter3H.setHours(dateBefore3H.getHours() + 3);

      if (revs.find((rev) => rev.match.date >= dateBefore3H && rev.match.date <= dateAfter3H) != null) {
        return {
          success: false,
          fatal: false,
          reason: "you already have a reservation for another match at this time."
        }
      }

      console.log(seats)

      for (const seat of seats) {
        try {
          await tx.reservation.create({
            data: {
              userId: user.id,
              matchId: matchId,
              seatIndex: seat,
            }
          })

          success.push(seat)
        } catch (e) {
          // failed this one
          console.log(e)
        }
      }

      return {
        success: true,
        fatal: false,
        reason: "",
      }
    })

    console.log(result)

    return {
      success: result?.success ?? false,
      fatal: result?.fatal ?? true,
      reason: result?.reason ?? "WTF",
      data: success
    }
  } catch (e) {
    console.log(e);
    return {
      success: false,
      fatal: true,
      reason: "internal server error"
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