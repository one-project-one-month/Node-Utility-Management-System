import { CookieOptions, NextFunction, Request, Response } from 'express';
import {
  loginService,
  refreshTokenService,
  logoutService,
} from '../services/authService';
import { UnauthorizedError } from '../common/errors';
import { successResponse } from '../common/apiResponse';

// Cookie configuration
const REFRESH_TOKEN_COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  // secure: process.env.NODE_ENV === 'production', // HTTPS in production
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, accessToken, refreshToken } = await loginService(
      req.validatedBody
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_CONFIG);

    successResponse(
      res,
<<<<<<< HEAD
      'log in successful',
=======
      'Login successful',
>>>>>>> acd6a94 (Auth&User API merge checked)
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

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
  
    const userId = req.user?.user_id;

    if (!userId) {
      throw new UnauthorizedError('User not authenticated');
    }

    await logoutService(userId);

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', REFRESH_TOKEN_COOKIE_CONFIG);

<<<<<<< HEAD
    successResponse(res, 'Log out successfully', null, 200);
=======
    successResponse(res, 'Logout successfully', null, 200);
>>>>>>> acd6a94 (Auth&User API merge checked)
  } catch (error) {
    next(error);
  }
}
