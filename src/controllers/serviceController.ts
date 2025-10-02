import { NextFunction, Request, Response } from "express";
import { successResponse } from "../common/apiResponse";
import { createCustomerService, updateCustomerService } from "../services/customerService";

export const createServiceController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const service = await createCustomerService(req.validatedBody)

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

export const updateServiceController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = { id: req.validatedParams.id, ...req.validatedBody }

        const service = await updateCustomerService(data)
        successResponse(res, "Service updated successful.", { service }, 200)
    } catch (error) {
        next(error)
    }


}