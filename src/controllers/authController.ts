import { NextFunction, Request, Response } from 'express';
import {
  signInService,
  refreshTokenService,
  signOutService,
} from '../services/authService';
import { UnauthorizedError } from '../common/errors';
import { successResponse } from '../common/apiResponse';

// Cookie configuration
const REFRESH_TOKEN_COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS in production
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function signInController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, accessToken, refreshToken } = await signInService(
      req.validatedBody
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_CONFIG);

    successResponse(
      res,
      'Sign in successful',
      {
        user,
        accessToken,
      },
      200
    );
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    const { newAccessToken, newRefreshToken } =
      await refreshTokenService(refreshToken);

    // Set new refresh token in HTTP-only cookie
    res.cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_CONFIG);

    successResponse(
      res,
      'Token refreshed successfully',
      {
        accessToken: newAccessToken,
      },
      200
    );
  } catch (error) {
    next(error);
  }
}

export async function signOutController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    await signOutService(userId);

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', REFRESH_TOKEN_COOKIE_CONFIG);

    successResponse(res, 'Sign out successfully', null, 200);
  } catch (error) {
    next(error);
  }
}
