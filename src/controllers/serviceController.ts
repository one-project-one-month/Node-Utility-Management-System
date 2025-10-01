import { NextFunction, Request, Response } from "express"
import { successResponse } from "../common/apiResponse"
import { createCustomerService } from "../services/customerService"

export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = req.validatedBody
        const service = await createCustomerService(data)
        successResponse(
            res,
            'Create service form  successful',
            {
                service: service
            },
            201
        )
    } catch (error) {
        next(error)
    }

}