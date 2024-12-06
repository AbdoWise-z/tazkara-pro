'use server'

import { revalidatePath } from 'next/cache'
import {stadiumSchema} from "@/forms/stadium-form";
import {db} from "@/lib/db";
import {currentUserProfile} from "@/lib/user-profile";

export async function addStadium(data: FormData) {
  const user = await currentUserProfile();
  if (!user || user.Role == "Fan") {
    return {
      success: false,
    }
  }
  const result = stadiumSchema.safeParse({
    name: data.get('name'),
    rowCount: Number(data.get('rowCount')),
    columnCount: Number(data.get('columnCount')),
  })

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors }
  }

  await db.stadium.create({
    data: result.data
  })

  const list = await db.stadium.findMany({})

  revalidatePath('/stadiums')
  return { success: true, data: list }
}

export async function editStadium(data: FormData) {
  const user = await currentUserProfile();
  if (!user || user.Role == "Fan") {
    return {
      success: false,
    }
  }

  const result = stadiumSchema.safeParse({
    id: data.get('id'),
    name: data.get('name'),
    rowCount: Number(data.get('rowCount')),
    columnCount: Number(data.get('columnCount')),
  })

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors }
  }

  const { id, ...updateData } = result.data

  await db.stadium.update({
    where: { id },
    data: updateData
  })

  const list = await db.stadium.findMany({})

  revalidatePath('/stadiums')
  return { success: true, data: list }
}

export async function deleteStadium(id: string) {
  const user = await currentUserProfile();
  if (!user || user.Role == "Fan") {
    return {
      success: false,
    }
  }

  await db.stadium.delete({
    where: { id }
  })

  const list = await db.stadium.findMany({})
  revalidatePath('/stadiums')
  return { success: true, data: list }
}

