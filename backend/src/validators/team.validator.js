import { z } from "zod";

export const createTeamSchema = z.object({
    name: z.string().trim(),
    description: z.string().trim(),
    totalMembers: z.number(),
    techUsed: z.string().trim()
})

export const joinTeamSchema = z.object({
    name: z.string().trim(),
    email: z.email({message: "Enter valid email"}).trim()
})