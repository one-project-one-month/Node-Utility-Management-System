import prisma from "../lib/prismaClient";
import { createServiceType } from "../validations/serviceSchema";

export const createCustomerService = async (data: createServiceType) => {
    return prisma.customerService.create({ data })
}