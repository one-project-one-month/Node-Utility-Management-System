import { BadRequestError } from "../common/errors";
import prisma from "../lib/prismaClient";
import { CreateUserType, GetUserParamType } from "../validations/userSchema";

export async function getAllUsersService() {
  return await prisma.user.findMany();
}

export async function getUserService(data:GetUserParamType) {
  return await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });
}

export async function createUserService(data: CreateUserType) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (existingUser) {
    throw new BadRequestError("User with this email already exists");
  }

  return await prisma.user.create({
    data: data
  });
}
