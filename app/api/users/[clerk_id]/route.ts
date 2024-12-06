import { NextResponse } from 'next/server';
import {auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clerk_id: string }> }
) {
  try {
    const clerk_id = (await params).clerk_id;
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (userId != clerk_id) return new NextResponse("Unauthorized", { status: 401 });

    const user = await db.user.findUnique({
      where: { clerk_id: clerk_id }
    });

    if (!user) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal error", { status: 500 });
  }
}