import {z} from "zod";

export const CardDetailsSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  cardholderName: z.string().min(2, 'Cardholder name must be at least 2 characters'),
})


export type CardDetailsFormData = z.infer<typeof CardDetailsSchema>