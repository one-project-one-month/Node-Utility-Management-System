import jwt from 'jsonwebtoken';
import { UserRole } from '../../../generated/prisma';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = '1d';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  tenantId: string | null;
  userId: string;
  email: string;
  role: UserRole;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
}
