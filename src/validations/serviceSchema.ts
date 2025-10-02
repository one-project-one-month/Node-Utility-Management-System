import z from "zod"

export const createCustomerServiceSchema = z.object({
    description: z.string("Description is required.").min(10, { message: "Description must be at least 10 characters" }),
    category: z.enum(["Complain", "Maintenance", "Other"]),
    status: z.enum(["Pending", "Ongoing", "Resolved"]),
    priority_level: z.enum(["Low", "Medium", "High"]),
    room_id: z.uuid()

})
export const updateCustomerServiceSchema = z.object({
    description: z.string("Description is required.").min(10, { message: "Description must be at least 10 characters" }).optional(),
    category: z.enum(["Complain", "Maintenance", "Other"]).optional(),
    status: z.enum(["Pending", "Ongoing", "Resolved"]),
    priority_level: z.enum(["Low", "Medium", "High"]),
    room_id: z.uuid()
})

export const idSchema = z.object({
    id: z.uuid()
})

export type createServiceType = z.infer<typeof createCustomerServiceSchema>
export type updateServiceType = z.infer<typeof updateCustomerServiceSchema>
export type id = z.infer<typeof idSchema>
