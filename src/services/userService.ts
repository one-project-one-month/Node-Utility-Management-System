import { BadRequestError, NotFoundError } from '../common/errors';
import { hashPassword } from '../common/auth/password';
import prisma from '../lib/prismaClient';
import {
  CreateUserType,
  GetAllUsersQueryType,
  UpdateUserType,
} from '../validations/userSchema';
import { Prisma } from '../../generated/prisma';

export async function getAllUsersService(query: GetAllUsersQueryType) {
  const whereClause: Prisma.UserWhereInput = {};

  // Add role filter
  if (query.role) {
    whereClause.role = query.role;
  }

  // Add is_active filter
  if (typeof query.is_active !== 'undefined') {
    whereClause.is_active = query.is_active;
  }

  // Calculate pagination
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalCount = await prisma.user.count({ where: whereClause });
  const totalPages = Math.ceil(totalCount / limit);

  // Get users with pagination
  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      user_name: true,
      email: true,
      role: true,
      tenant_id: true,
      is_active: true,
      updated_at: true,
      created_at: true,
      // Exclude password field from the result
    },
    skip,
    take: limit,
    orderBy: { created_at: 'desc' },
  });

  // Build pagination info
  const pagination = {
    count: users.length,
    prevPage: page > 1 ? page - 1 : false,
    nextPage: page < totalPages ? page + 1 : false,
    page,
    limit,
    totalPages,
    totalCount,
  };

  return {
    users,
    pagination,
  };
}

export async function getUserService(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      user_name: true,
      email: true,
      role: true,
      tenant_id: true,
      is_active: true,
      created_at: true,
      updated_at: true,
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
      user_name: data.user_name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
    select: {
      id: true,
      user_name: true,
      email: true,
      role: true,
      tenant_id: true,
      is_active: true,
      created_at: true,
      updated_at: true,
    },
  });
}

// todo: tenant_id check
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
      user_name: true,
      email: true,
      role: true,
      tenant_id: true,
      is_active: true,
      created_at: true,
      updated_at: true,
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
      user_name: true,
      email: true,
      role: true,
      tenant_id: true,
      is_active: true,
      created_at: true,
      updated_at: true,
    },
  });
}
