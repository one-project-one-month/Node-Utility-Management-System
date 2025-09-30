import { NextFunction, Request, Response } from "express";
import { getAllUsersService, getUserService, createUserService } from "../services/userService";
import { NotFoundError } from "../common/errors";

export async function getAllUsersController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getAllUsersService();

    if (!user) {
      throw new NotFoundError("No users found");
    }

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getUserService(req.validatedParams);

    if (!user) {
      throw new NotFoundError("No users found");
    }

    res.status(200).json({ data: user });
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
    console.log(req.body);
    const user = await createUserService(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}