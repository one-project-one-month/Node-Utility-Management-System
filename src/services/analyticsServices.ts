import { Request } from "express";
import prisma from "../lib/prismaClient";
import { validateRequestQuery } from "../middlewares/validationMiddleware";
import type { AnalyticsServiceCount } from "../validations/analyticsSchema";
import { PriorityLevel, Prisma, ServiceStatus } from "../../generated/prisma";



const countFieldsHelper = async (
    field: keyof Prisma.CustomerServiceWhereInput,
    values: string[],
    status?: ServiceStatus
) => {
    if (status) {
        return await prisma.$transaction([
            prisma.customerService.count({ where: { [field]: status } }),
            ...values.map(v => prisma.customerService.count({ where: { [field]: status, priorityLevel: v as PriorityLevel } }))
        ]

        )

    }
    return await prisma.$transaction(
        values.map(v => prisma.customerService.count({ where: { [field]: v as any } }))
    )
}

export const getAnalyticServiceCount = async (req: Request) => {

    const { query, status = "Pending", } = req.validatedQuery as AnalyticsServiceCount;
    console.log(query);
    if (query === "priority") {
        const [high, medium, low] = await countFieldsHelper('priorityLevel', ["High", "Medium", "Low"])
        return { countByPriority: { high, medium, low } };
    }

    if (query === "category") {
        const [complain, maintenance, other] = await countFieldsHelper('category', ["Complain", "Maintenance", "Other"])
        return { countByCategory: { complain, maintenance, other } };
    }

    if (query === "status") {
        if (status === "Pending") {
            const [all, high, medium, low] = await countFieldsHelper('status', ["High", "Medium", "Low"], status)
            return { countByStatus: { pending: { all, high, medium, low } } };
        }
        if (status === "Ongoing") {
            const [all, high, medium, low] = await countFieldsHelper('status', ["High", "Medium", "Low"], status)
            return { countByStatus: { ongoing: { all, high, medium, low } } };
        }
        if (status === "Resolved") {
            const [all, high, medium, low] = await countFieldsHelper('status', ["High", "Medium", "Low"], status)
            return { countByStatus: { resolved: { all, high, medium, low } } };
        }
    }
}