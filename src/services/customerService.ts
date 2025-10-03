<<<<<<< HEAD
import { CustomerService } from '../../generated/prisma';
import { NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';
import {
    createServiceType,
    paginationQueryType,
    tenantIdAndStatusType,
} from '../validations/serviceSchema';

//create customer service
export const createCustomerService = async (
    tenantId: string,
    data: createServiceType
) => {
    // Check if tenant exists
    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true },
    });

    if (!tenant) {
        throw new NotFoundError('Tenant not found');
    }

    // Check if room_id exists
    const room = await prisma.room.findUnique({
        where: { id: data.room_id },
        select: { id: true },
    });

    if (!room) {
        throw new NotFoundError('Room not found')
    }

    return await prisma.customerService.create({ data });
};

//get service history by tenantId 
export const cutomerServiceHistory = async (
    { id, status }: tenantIdAndStatusType,
    { page, limit }: paginationQueryType,
) => {
    const skip = (page - 1) * limit;
    // Check if tenant exists
    const tenant = await prisma.tenant.findUnique({
        where: { id },
        select: { id: true, room_id: true },
    });

    if (!tenant) {
        throw new NotFoundError('Tenant not found');
    };

    //Get customer service history and total count
    const [history, total] = await Promise.all([
        prisma.customerService.findMany({
            where: {
                room_id: tenant.room_id,
                status,
            },
            skip,
            take: limit,
        }),
        prisma.customerService.count({
            where: {
                room_id: tenant.room_id,
                status,
            },
        }),
    ]);

    //Check history exits
    if (!history || history.length === 0) {
        throw new NotFoundError("No customer service history found.");
    };

    //Total pages for pagination
    const totalPages = Math.ceil(total / limit);

    return {
        history,
        pagination: {
            prevPage: page > 1,
            nextPage: page < totalPages,
            page,
            limit,
            totalPages,
        },
    };
}

//update customer service
export const updateCustomerService = async (data: CustomerService) => {
    const existingService = await prisma.customerService.findUnique({
        where: { id: data.id },
        select: { id: true },
    });
    if (!existingService) {
        throw new NotFoundError(`No customer service found for this-${data.id}`);
    }

    return await prisma.customerService.update({ where: { id: data.id }, data });
};

//get all cutomer service
export const getAllCustomerService = async (
    { page, limit }: paginationQueryType
) => {
    const skip = (page - 1) * limit;

    //Get sevices and count
=======
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
>>>>>>> 7ad34e3 (pulled from dev)
    const [services, total] = await Promise.all([
        prisma.customerService.findMany({
            skip,
            take: limit,
        }),
        prisma.customerService.count(),
    ]);
<<<<<<< HEAD

    //Total pages for pagination
    const totalPages = Math.ceil(total / limit);

    return {
        services,
        pagination: {
            prevPage: page > 1,
            nextPage: page < totalPages,
            page,
            limit,
            totalPages,
        },
    };
};

//get customer service by id
export const getCustomerServiceById = async (id: string) => {
    const service = await prisma.customerService.findUnique({ where: { id } });
    if (!service) {
        throw new NotFoundError(`No customer service found for this-${id}`);
    }
    return service;
};
=======
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
>>>>>>> 7ad34e3 (pulled from dev)
