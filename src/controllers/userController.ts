import { NextFunction, Request, Response } from 'express';
import { createUserService } from '../services/userService';

export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const newUser = await createUserService(req.validatedBody);
    res.status(201).json({
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
}
