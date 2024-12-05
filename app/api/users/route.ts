import { NextResponse } from 'next/server';
import {auth} from "@clerk/nextjs/server";
import {userFormSchema} from "@/forms/user-form";
import {ApiError} from "next/dist/server/api-utils";
import {db} from "@/lib/db";

export async function POST(
  req: Request,
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const parsedBody = {
      ...body,
      birthDate: body.birthDate ? new Date(body.birthDate) : null
    };

    const validatedData = userFormSchema.parse(parsedBody);

    const user = await db.user.update({
      where: {
        clerk_id: userId,
      },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        BirthDate: validatedData.birthDate,
        Gender: validatedData.gender,
        City: validatedData.city,
        Address: validatedData.address,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return new NextResponse(error.message, { status: error.statusCode });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}