import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../common/errors';
import { verifyAccessToken } from '../common/auth/jwt';
import { UserRole } from '../../generated/prisma';

export function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    throw new UnauthorizedError('Access token is required');
  }

  try {
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw new UnauthorizedError('Invalid or expired token');
    }
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function hasRole(allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(`Required roles: ${allowedRoles.join(', ')}`);
    }
    next();
  };
}
