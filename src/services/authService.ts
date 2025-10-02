import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from '../common/auth/jwt';
import { comparePassword } from '../common/auth/password';
import { NotFoundError, UnauthorizedError } from '../common/errors';
import prisma from '../lib/prismaClient';
import { LoginType } from '../validations/authSchema';

export async function loginService(data: LoginType) {
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
    tenant_id: user.tenant_id,
    user_id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token in database and return user data without password and refresh_token
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { refresh_token: refreshToken },
    select: {
      email: true,
      id: true,
      user_name: true,
      role: true,
      tenant_id: true,
      is_active: true,
      created_at: true,
      updated_at: true,
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
    where: { id: payload.user_id },
    select: {
      id: true,
      email: true,
      role: true,
      tenant_id: true,
      refresh_token: true,
    },
  });

  if (!user || user.refresh_token !== refreshToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  // Generate new tokens
  const tokenPayload: TokenPayload = {
    tenant_id: user.tenant_id,
    user_id: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  // Update refresh token in database
  await prisma.user.update({
    where: { id: user.id },
    data: { refresh_token: newRefreshToken },
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
    data: { refresh_token: null },
  });
}
