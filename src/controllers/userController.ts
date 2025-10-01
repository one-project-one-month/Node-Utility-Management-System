import { NextFunction, Request, Response } from 'express';
import { createUserService } from '../services/userService';
import { successResponse } from '../common/apiResponse';

export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const newUser = await createUserService(req.validatedBody);
    successResponse(res, 'User created successfully', newUser, 201);
  } catch (error) {
    next(error);
  }
}
