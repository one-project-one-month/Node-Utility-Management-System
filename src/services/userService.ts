import { BadRequestError, NotFoundError } from '../common/errors';
import { hashPassword } from '../common/auth/password';
import prisma from '../lib/prismaClient';
import {
  CreateUserType,
  GetAllUsersQueryType,
  UpdateUserType,
} from '../validations/userSchema';
import { Prisma } from '../../generated/prisma';
import { generatePaginationData } from '../common/utils/paginationHelper';
import { Request } from 'express';

export async function getAllUsersService(
  query: GetAllUsersQueryType,
  req: Request
) {
  const whereClause: Prisma.UserWhereInput = {};

  // Calculate pagination
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // Add role filter
  if (query.role) {
    whereClause.role = query.role;
  }

  // Add isActive filter
  if (typeof query.isActive !== 'undefined') {
    whereClause.isActive = query.isActive;
  }

  // Get users & totalCount with pagination
  const [users, totalCount] = await prisma.$transaction([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        tenantId: true,
        isActive: true,
        updatedAt: true,
        createdAt: true,
        // Exclude password field from the result
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return {
    data: users,
    ...paginationData,
  };
}

export async function getUserService(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
      tenantId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      // Exclude password from results
    },
  });
}

export async function createUserService(data: CreateUserType) {
  // Check if user with the same email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new BadRequestError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create new user and Return user data without password and refreshToken
  return await prisma.user.create({
    data: {
      userName: data.userName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
      tenantId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

// todo: tenantId check
export async function updateUserService(userId: string, data: UpdateUserType) {
  // Find if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
    },
  });

  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  // Check email is taken if provided
  if (data.email && data.email !== existingUser.email) {
    const emailTaken = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (emailTaken) {
      throw new BadRequestError('Email is already taken');
    }
  }

  // Hash password if provided
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
      tenantId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUserService(userId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  return await prisma.user.delete({
    where: { id: userId },
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
      tenantId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
