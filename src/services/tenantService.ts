import { BadRequestError } from '../common/errors/badRequestError';
import prisma from '../lib/prismaClient';
import { CreateTenantType } from '../validations/tenantSchema';

export async function createTenantService(data: CreateTenantType) {
  const room = await prisma.room.findUnique({ where: { id: data.room_id } });
  if (!room) {
    throw new BadRequestError('Room not found');
  }

  const existingTenantForRoom = await prisma.tenant.findUnique({
    where: { room_id: data.room_id },
  });
  if (existingTenantForRoom)
    throw new BadRequestError('Room already has a tenant');

  const checkDuplicateTenantEmails = await prisma.tenant.findFirst({
    where: { emails: { hasSome: data.emails } },
  });
  if (checkDuplicateTenantEmails) {
    throw new BadRequestError('Some emails are already registered');
  }

  const tenantWithDuplicateNrcs = await prisma.tenant.findFirst({
    where: { nrcs: { hasSome: data.nrcs } },
  });
  if (tenantWithDuplicateNrcs) {
    throw new BadRequestError('Some NRC numbers are already registered');
  }

  return await prisma.tenant.create({
    data,
  });
}
