'use server'

import {db} from "@/lib/db";
import {currentUserProfile} from "@/lib/user-profile";
import {Match} from "@prisma/client";
import {MatchWReservationsCountWStadium} from "@/app/(main)/match/types";


export async function getAllStadiums() {
  const user = await currentUserProfile();
  if (!user || user.Role == "Fan") {
    return {
      success: false,
    }
  }

  const data = await db.stadium.findMany({})
  return {
    success: true,
    data: data
  }
}


export async function getMatches() {
  const matches = await db.match.findMany({
    orderBy: {
      date: "asc",
    },
    include: {
      stadium: true,
      Reservations: true,
    },
    take: 100
  })

  const resultMatches: MatchWReservationsCountWStadium[] = []
  for (const match of matches) {
    resultMatches.push({
      ...match,
      reservations: match.Reservations.length,
      maxReservations: match.stadium.rowCount * match.stadium.columnCount,
    })
  }

  return resultMatches;
}

export async function createMatch(match: Match) {
  const user = await currentUserProfile();
  if (!user || user.Role == "Fan") {
    return {
      success: false,
      reason: "no permission",
      fatal: true,
    }
  }


  // first we find the stadium
  const stadium = await db.stadium.findUnique({
    where: {
      id: match.stadiumId,
    }
  });

  if (!stadium) {
    return {
      success: false,
      reason: "argument error",
      fatal: true,
    }
  }

  // then we check date
  const dateBefore3H = new Date(match.date);
  dateBefore3H.setHours(dateBefore3H.getHours() - 3);
  const dateAfter3H = new Date(match.date);
  dateAfter3H.setHours(dateBefore3H.getHours() + 3);
  const matches = await db.match.findMany({
    where: {
      stadiumId: match.stadiumId,
      date: {
        gt: dateBefore3H,
        lt: dateAfter3H
      }
    }
  })

  if (matches != null && matches.length > 0) {
    return {
      success: false,
      reason: "another match is using this stadium at this time",
      fatal: false,
    }
  }

  await db.match.create({
    data: match
  })

  const updated = await getMatches();

  return {
    success: true,
    data: updated
  }
}

export async function updateMatch(match: Match) {
  const user = await currentUserProfile();
  if (!user || user.Role == "Fan") {
    return {
      success: false,
      reason: "no permission",
      fatal: true,
    }
  }

  try {
    await db.$transaction(async (tx) => {
      await tx.match.delete({
        where: {
          id: match.id
        }
      })

      // first we find the stadium
      const stadium = await tx.stadium.findUnique({
        where: {
          id: match.stadiumId,
        }
      });

      if (!stadium) {
        throw {
          success: false,
          reason: "argument error",
          fatal: true,
        }
      }

      // then we check date
      const dateBefore3H = new Date(match.date);
      dateBefore3H.setHours(dateBefore3H.getHours() - 3);
      const dateAfter3H = new Date(match.date);
      dateAfter3H.setHours(dateBefore3H.getHours() + 3);
      const matches = await tx.match.findMany({
        where: {
          stadiumId: match.stadiumId,
          date: {
            gt: dateBefore3H,
            lt: dateAfter3H
          }
        }
      })

      if (matches != null && matches.length > 0) {
        throw {
          success: false,
          reason: "another match is using this stadium at this time",
          fatal: false,
        }
      }

      await db.match.create({
        data: {
          ...match,
          id: undefined,
        }
      });

      return true
    }, {
      maxWait: 5000,
      timeout: 10000,
    })

    const updated = await getMatches();

    return {
      success: true,
      data: updated
    }
  } catch (e: unknown) {
    console.log(e);
    return {
      success: false,
      // @ts-expect-error e may not be the error we're expecting
      fatal: e.fatal ?? true,
      // @ts-expect-error e may not be the error we're expecting
      reason: e.reason ?? "idk"
    }
  }
}


export async function deleteMatch(match: Match) {
  const user = await currentUserProfile();
  if (!user || user.Role == "Fan") {
    return {
      success: false,
      reason: "no permission",
      fatal: true,
    }
  }

  const result = await db.match.delete({
    where: {
      id: match.id
    }
  })

  const data = result != null ? await getMatches() : null;

  return {
    success: result != null,
    data: data
  }
}

export async function getMatchById(id: string) {
  return db.match.findUnique({
    where: { id },
  })
}



