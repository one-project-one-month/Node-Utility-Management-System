import { CustomerService } from "../../generated/prisma";
import { NotFoundError } from "../common/errors";
import prisma from "../lib/prismaClient";
import { createServiceType, paginationQueryType } from "../validations/serviceSchema";

//create customer service 
export const createCustomerService = async (data: createServiceType) => {
    return prisma.customerService.create({ data })
}

//update customer service 
export const updateCustomerService = async (data: CustomerService) => {
    const existingService = await prisma.customerService.findUnique({ where: { id: data.id } })
    if (!existingService) {
        throw new NotFoundError('Invalid customer service id.');
    }

    return await prisma.customerService.update({ where: { id: data.id }, data })
}

//get all cutomer service
export const getAllCustomerService = async (data: paginationQueryType) => {
    const { page, limit } = data
    const skip = (page - 1) * limit
    const [services, total] = await Promise.all([
        prisma.customerService.findMany({
            skip,
            take: limit,
        }),
        prisma.customerService.count(),
    ]);
    return {
        services,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    }
}

//get customer service by id
export const getCustomerServiceById = async (id: string) => {
    const service = await prisma.customerService.findUnique({ where: { id } })
    if (!service) {
        throw new NotFoundError("Invalid customer service id!")
    }
    return service
}