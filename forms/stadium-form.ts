import * as z from "zod";

export const stadiumSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
  rowCount: z.number().int().positive("Row count must be a positive integer").max(30),
  columnCount: z.number().int().positive("Column count must be a positive integer").max(30),
})


export type StadiumFormData = z.infer<typeof stadiumSchema>