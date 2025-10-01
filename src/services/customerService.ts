import { CustomerService } from "../../generated/prisma";
import prisma from "../lib/prismaClient"
import { createServicType } from "../validations/serviceSchema"

interface CustomerServiceType {
    description: string;
    category: "Complain" | "Maintenance" | "Other";
    status: "Pending" | "Ongoing" | "Resolved";
    priority_level: "Low" | "Medium" | "High";
    room_id: string;
}

export const createCustomerService = async (data: CustomerServiceType): Promise<CustomerService> => {
    return await prisma.customerService.create({
        data
    })
}