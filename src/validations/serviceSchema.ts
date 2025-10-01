import { z } from "zod";

export const serviceSchema = z.object({
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    category: z.enum(["Complain", "Maintenance", "Other"]),
})
export const idParamSchema = z.object({
    id: z.uuid("Invalid tenat Id!")
})

export type createServicType = z.infer<typeof serviceSchema>