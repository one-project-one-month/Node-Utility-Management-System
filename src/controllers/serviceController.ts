import { NextFunction, Request, Response } from "express";
import { validateRequestBody } from "../middlewares/validationMiddlware";
import { successResponse } from "../common/apiResponse";
import { createCustomerService } from "../services/customerService";

export const serviceController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const service = await createCustomerService(req.validatedBody)
        console.log(service)

        successResponse(res,
            'Create service from  successful',
            {
                service
            },
            201)
    } catch (error) {
        next(error)
    }
}