"use server";


import {currentUserProfile} from "@/lib/user-profile";
import {db} from "@/lib/db";
import {MatchWithTickets} from "@/app/(main)/tickets/types";

export async function getMatchesWithReservations() {
  const user = await currentUserProfile();
  if (!user) {
    return {
      success: false,
      fatal: true,
      reason: "no user"
    }
  }


  const reservations = await db.reservation.findMany({
    where: {
      userId: user.id,
    },
  })

  const grouped_by_match = new Map();
  for (const rev of reservations) {
    if (!grouped_by_match.has(rev.matchId)) {
      grouped_by_match.set(rev.matchId, []);
    }

    grouped_by_match.set(rev.matchId, [...grouped_by_match.get(rev.matchId), rev]);
  }

  const result: MatchWithTickets[] = [];
  for (const match of grouped_by_match.keys()) {
    const matchData = await db.match.findUnique({
      where: {
        id: match
      },
      include: {
        stadium: true
      }
    })
    if (matchData) {
      result.push({
        ...matchData,
        tickets: [],
      })
    }
  }

  for (const rev of reservations) {
    const h = result.find((k) => k.id == rev.matchId);
    if (h) {
      h.tickets.push(rev)
    }
  }

  return {
    success: true,
    data: result
  }

}


export async function removeReservation(matchId: string, seat: number) {
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