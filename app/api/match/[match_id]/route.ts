import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ match_id: string }> }
) {
  try {
    const matchId = (await params).match_id;
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const match = await db.match.findUnique({
      where: {
        id: matchId,
      },
      include: {
        stadium: true,
        Reservations: true,
      }
    });

    return NextResponse.json(match);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}