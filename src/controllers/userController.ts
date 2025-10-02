import { NextFunction, Request, Response } from 'express';
import {
  getAllUsersService,
  getUserService,
  createUserService,
  updateUserService,
  deleteUserService,
} from '../services/userService';
import { NotFoundError } from '../common/errors';
import { successResponse } from '../common/apiResponse';

export async function getAllUsersController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filters = req.validatedQuery;
    const user = await getAllUsersService(filters);

    if (!user || !user.length) {
      throw new NotFoundError('No users found');
    }
    successResponse(res, 'Users fetched successfully', user);
  } catch (error) {
    console.log('Error in getAllUsersController:', error);
    next(error);
  }
}

export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getUserService(req.validatedParams.userId);

    if (!user) {
      throw new NotFoundError('No users found');
    }

    successResponse(res, 'User fetched successfully', user);
  } catch (error) {
    next(error);
  }
}

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

export async function updateUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Implementation for updating a user
    const updatedUser = await updateUserService(
      req.validatedParams.userId,
      req.validatedBody
    );

    successResponse(res, 'User updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function deleteUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Implementation for deleting a user
    const deletedUser = await deleteUserService(req.validatedParams.userId);

    successResponse(res, 'User deleted successfully', deletedUser);
  } catch (error) {
    next(error);
  }
}
