import { NextFunction, Request, Response } from "express"
import { successResponse } from "../common/apiResponse"
import { createCustomerService } from "../services/customerService"
import prisma from "../lib/prismaClient"
import { BadRequestError } from "../common/errors"

export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { category, description } = req.validatedBody
        const id = req.validatedParams
        const tenant = await prisma.tenant.findUnique({ where: { id } })

        if (!tenant) {
            throw new BadRequestError('Invalid tenatId.');
        }
        const service = createCustomerService({ category, description, status: "Pending", priority_level: "Medium", room_id: tenant.room_id })
        successResponse(
            res,
            'Create service form  successful',
            {
                service
            },
            201
        )
    } catch (error) {
        next(error)
    }

}