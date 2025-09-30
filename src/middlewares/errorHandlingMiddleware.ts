import { CustomError } from '../common/errors';
import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      status: err.statusCode,
      // details: err.generateErrors()
    });
  } else {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      status: 500,
    });
  }
};
