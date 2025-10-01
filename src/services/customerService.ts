import { CustomerService } from "../../generated/prisma";
import prisma from "../lib/prismaClient"
import { createServicType } from "../validations/serviceSchema"



export const createCustomerService = async (data: createServicType): Promise<CustomerService> => {
    return await prisma.customerService.create({
        data
    })
}