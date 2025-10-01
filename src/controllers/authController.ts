import { NextFunction, Request, Response } from 'express';
import {
  loginService,
  logoutService,
  refreshTokenService,
} from '../services/authService';
import { NotFoundError } from '../common/errors';
import { successResponse } from '../common/apiResponse';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    SameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = req.validatedBody;
    const {user, accessToken, refreshToken} = await loginService(data);

    res.cookie('jwt', refreshToken, COOKIE_OPTIONS);

    successResponse(res, 'Login successful', {user, accessToken});
  } catch (error) {
    next(error);
  }
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new NotFoundError('User not found');
    }

    await logoutService(userId);

    res.clearCookie('jwt', COOKIE_OPTIONS);

    successResponse(res, 'Logout successful');
  } catch (error) {
    next(error);
  }
}

export async function refreshController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            throw new NotFoundError('No refresh token found');
        }
        const refreshToken = cookies.jwt;

        const {newAccessToken, newRefreshToken} = await refreshTokenService(refreshToken);
        res.cookie('jwt', newRefreshToken, COOKIE_OPTIONS );

        successResponse(res, 'Token refreshed successfully', {accessToken: newAccessToken});
    } catch (error) {
        next(error);
    }
}