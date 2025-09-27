import { CustomError } from "../common/errors";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      error: err.message,
      details: err.generateErrors(),
    });
  } else {
    res.status(500).json({
      message: "Something went wrong. Internal server error",
    });
  }
};
