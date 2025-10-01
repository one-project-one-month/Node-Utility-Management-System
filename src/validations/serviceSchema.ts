import { z } from "zod";

export const serviceSchema = z.object({
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    category: z.enum(["Complain", "Maintenance", "Other"]),
    status: z.enum(["Pending", "Ongoing", "Resolved"]).default("Pending"),
    priority_level: z.enum(["Low", "Medium", "High"]).default("Medium"),
    room_id: z.uuid("Invalid room id"),
})


export type createServicType = z.infer<typeof serviceSchema>