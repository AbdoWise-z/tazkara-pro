import {z} from "zod";

export const matchSchema = z.object({
  homeTeam: z.string().min(1, "Home team is required"),
  awayTeam: z.string().min(1, "Away team is required"),
  date: z.date().refine((date) => date > new Date(), {
    message: "Match date must be in the future",
  }),
  mainReferee: z.string().min(1, "Main referee is required"),
  linesMen: z.tuple([
    z.string().min(1, "First linesman is required"),
    z.string().min(1, "Second linesman is required"),
  ]),
  stadiumId: z.string().min(1, "Stadium selection is required"),
})

export type MatchFormData = z.infer<typeof matchSchema>