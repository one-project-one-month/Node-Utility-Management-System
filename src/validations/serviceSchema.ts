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


export const paginationQuerySchema = z.object({
    page: z
        .string()
        .regex(/^\d+$/, "Page must be a number") // ensure numeric string
        .transform(Number)                       // convert to number
        .refine((val) => val > 0, "Page must be greater than 0")
        .default(1),
    limit: z
        .string()
        .regex(/^\d+$/, "Limit must be a number")
        .transform(Number)
        .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100")
        .default(10),
});



export type createServiceType = z.infer<typeof createCustomerServiceSchema>
export type updateServiceType = z.infer<typeof updateCustomerServiceSchema>
export type paginationQueryType = z.infer<typeof paginationQuerySchema>
