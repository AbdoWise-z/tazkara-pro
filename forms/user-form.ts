import * as z from "zod";

export const userFormSchema = z.object({
  firstName: z.string({
    message: "please enter your first name"
  })
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Only letters and spaces are allowed"),
  lastName: z.string({
    message: "please enter your last name"
  })
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Only letters and spaces are allowed"),
  birthDate: z.date({
    message: "please enter your birthday"
  })
    .min(new Date("1900-01-01"), "Date must be after 1900")
    .max(new Date(), "Date cannot be in the future"),
  gender: z.boolean(),
  city: z.string({
    message: "I'll find you."
  })
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s]*$/, "Only letters, spaces and numbers are allowed"),
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters")
    .nullable(),
});