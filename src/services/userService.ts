import { hashPassword } from '../common/auth/password';
import { BadRequestError } from '../common/errors';
import prisma from '../lib/prismaClient';
import { CreateUserType } from '../validations/userSchema';

export async function createUserService(data: CreateUserType) {
  // Check if user with the same email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new BadRequestError('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create new user and Return user data without password and refreshToken
  const newUser = await prisma.user.create({
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
      is_active: true,
      created_at: true,
      updated_at: true,
    },
  });

  return {
    user: newUser,
  };
}
