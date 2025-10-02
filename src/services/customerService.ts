import { CustomerService } from "../../generated/prisma";
import { NotFoundError } from "../common/errors";
import prisma from "../lib/prismaClient";
import { createServiceType } from "../validations/serviceSchema";

export const createCustomerService = async (data: createServiceType) => {
    return prisma.customerService.create({ data })
}

export const updateCustomerService = async (data: CustomerService) => {
    const existingService = await prisma.customerService.findUnique({ where: { id: data.id } })
    if (!existingService) {
        throw new NotFoundError('User not found');
    }

    return await prisma.customerService.update({ where: { id: data.id }, data })
}