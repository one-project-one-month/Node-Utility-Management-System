import { NextFunction, Request, Response } from "express";
import { getUserService, createUserService } from "../services/userService";
import { NotFoundError } from "../common/errors";

export async function getUserController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await getUserService(req.validatedQuery);

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
    const user = await createUserService(req.validatedBody);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}
