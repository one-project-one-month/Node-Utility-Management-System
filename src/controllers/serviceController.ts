import { NextFunction, Request, Response } from "express";
import { successResponse } from "../common/apiResponse";
import { createCustomerService, getAllCustomerService, getCustomerServiceById, updateCustomerService } from "../services/customerService";



//create customer service from client
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

// update customer service
export const updateServiceController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = { id: req.validatedParams.id, ...req.validatedBody }

        const service = await updateCustomerService(data)
        successResponse(res, "Service updated successful.", { service }, 200)
    } catch (error) {
        next(error)
    }


}

//get all customer services 
export const getAllServiceController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await getAllCustomerService(req.validatedQuery)
        successResponse(res, "Get all customer serivice successfull.", result, 200)
    } catch (error) {
        next(error)
    }

}

//get customer service by id

export const getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const service = await getCustomerServiceById(req.validatedParams.id)
        successResponse(res, "Get all customer serivice successfull.", { service }, 200)
    } catch (error) {
        next(error)
    }

}
