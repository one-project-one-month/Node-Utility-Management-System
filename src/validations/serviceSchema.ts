import z from "zod";

export const customerServiceSchema = z.object({
    description: z.string("Description is required.").min(10, { message: "Description must be at least 10 characters" }),
    category: z.enum(["Complain", "Maintenance", "Other"]),
    status: z.enum(["Pending", "Ongoing", "Resolved"]),
    priority_level: z.enum(["Low", "Medium", "High"]),
    room_id: z.uuid()

})

export type createServiceType = z.infer<typeof customerServiceSchema>