import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from '../common/auth/jwt';
import { comparePassword } from '../common/auth/password';
import { NotFoundError, UnauthorizedError } from '../common/errors';
import prisma from '../lib/prismaClient';
import { LogInType } from '../validations/authSchema';

export async function loginService(data: LogInType) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Password is incorrect');
  }

  // Generate tokens
  const tokenPayload: TokenPayload = {
    tenantId: user.tenantId,
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token in database and return user data without password and refreshToken
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
    select: {
      email: true,
      id: true,
      userName: true,
      role: true,
      tenantId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    user: updatedUser,
    accessToken,
    refreshToken,
  };
}

export async function refreshTokenService(refreshToken: string) {
  // Verify refresh token
  let payload: TokenPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  // Find user and verify refresh token matches
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      role: true,
      tenantId: true,
      refreshToken: true,
    },
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  // Generate new tokens
  const tokenPayload: TokenPayload = {
    tenantId: user.tenantId,
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  // Update refresh token in database
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken },
  });

  return {
    newAccessToken,
    newRefreshToken,
  };
}

export async function logoutService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
}
