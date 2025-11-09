import { Request, Response, NextFunction } from "express";
import { successResponse } from "../common/apiResponse";
import { getAnalyticServiceCount } from "../services/analyticsServices";

export const getAnalyticServiceCountController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data = await getAnalyticServiceCount(req)
        successResponse(
            res,
            "Get analytic customer service count data sccessful.",
            { data },
            200,
        )

    } catch (error) {
        next(error)
    }
}