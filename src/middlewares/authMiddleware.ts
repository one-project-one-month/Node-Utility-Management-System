import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../common/errors';
import { verifyAccessToken } from '../common/auth/jwtToken';
import { UserRole } from '../../generated/prisma';

export const verifyToken = (req: Request, _res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return next(new UnauthorizedError('No token provided'));
    }

    try {
        const verifyPayload = verifyAccessToken(token);
        req.user = verifyPayload;
        next();
    } catch (error) {
        return next(new UnauthorizedError('Invalid or Expired token'));
    }
}

export function hasRole(allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      throw new UnauthorizedError(`Required roles: ${allowedRoles.join(', ')}`);
    }
    next();
  };
}