// src/services/userService.ts

import { BadRequestError, NotFoundError } from '../common/errors';
import prisma from '../lib/prismaClient';

import {
  CreateUserType,
  GetUserQueryType,
} from '../validations/userSchema';
import bcrypt from 'bcrypt';

export async function getAllUsersService(query: GetUserQueryType) {
  const whereClause: any = {}
  // OR 
  // const whereClause: Prisma.UserWhereInput = {} // for type safety

  if (query.email) {
    whereClause.email = query.email;
  }

  return await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      user_name: true,
      email: true,
      updated_at: true,
      created_at: true,
      role: true,
      // Exclude password field from the result
    }
  });
}

export async function getUserService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      user_name: true,
      email: true,
      created_at: true,
      updated_at: true,
      role: true,
      // Exclude password from results
    },
  });

  return user;
}

export async function createUserService(data: CreateUserType) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new BadRequestError('User with this email already exists');
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      user_name: true,
      email: true,
      created_at: true,
      updated_at: true,
      role: true,
      // Exclude password from response
    },
  });
}

export async function updateUserService(userId: string, data: Partial<CreateUserType>) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  if (data.email && data.email !== existingUser.email) {
    const emailTaken = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailTaken) {
      throw new BadRequestError('Email is already taken');
    }
  }

  if (data.password) {
    const salt = await bcrypt.genSalt(12);
    data.password = await bcrypt.hash(data.password, salt);
  }

  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      user_name: true,
      email: true,
      created_at: true,
      updated_at: true,
      // Exclude password from response
    },
  });
}

export async function deleteUserService(userId: string) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
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
      created_at: true,
      updated_at: true,
      // Exclude password from response
    },
  });
}