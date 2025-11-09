import { Request } from "express";
import type { AnalyticsServiceCount } from "../validations/analyticsSchema";
import { Category, PriorityLevel } from "../../generated/prisma";
import { NotFoundError } from "../common/errors";
import { countFieldsHelper, serviceDateRangeHelper } from "../helpers/ServiceAnalyticHelper";


// Analytic customer service counts
export const getAnalyticServiceCount = async (req: Request) => {

    const { query, status = "Pending", from, to } = req.validatedQuery as AnalyticsServiceCount;

    //Get Date range default 30 days from current to previous
    const dateRange = serviceDateRangeHelper(from, to)

    const priorityValues: PriorityLevel[] = ["High", "Medium", "Low"]
    const categoryValues: Category[] = ["Complain", "Maintenance", "Other"];

    //Count by priority filed
    if (query === "priority") {
        const [high, medium, low] = await countFieldsHelper('priorityLevel', priorityValues, dateRange)
        return { countByPriority: { high, medium, low } };
    }

    //Count by category field
    if (query === "category") {
        const [complain, maintenance, other] = await countFieldsHelper('category', categoryValues, dateRange)
        return { countByCategory: { complain, maintenance, other } };
    }
    //Count by status filed
    if (query === "status") {
        if (status === "Pending") {
            const [all, high, medium, low] = await countFieldsHelper('status', priorityValues, dateRange, status,)
            return { countByStatus: { [status.toLowerCase()]: { all, high, medium, low } } };
        };
        if (status === "Ongoing") {
            const [all, high, medium, low] = await countFieldsHelper('status', priorityValues, dateRange, status,)
            return { countByStatus: { [status.toLowerCase()]: { all, high, medium, low } } };
        };
        if (status === "Resolved") {
            const [all, high, medium, low] = await countFieldsHelper('status', priorityValues, dateRange, status,)
            return { countByStatus: { [status.toLowerCase()]: { all, high, medium, low } } };
        };

        throw new NotFoundError("Invalid status query parameter.")
    }


    throw new NotFoundError("Invalid query parameter.")
}