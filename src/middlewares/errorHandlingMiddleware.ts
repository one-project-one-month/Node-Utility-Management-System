import { CustomError, ValidationError } from '../common/errors';
import { NextFunction, Request, Response } from 'express';
import { logEvents } from '../common/utils/customLogger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logEvents(
    `${err.name}: ${err.message}\t${_req.method}\t${_req.url}\t${_req.headers.origin}`,
    'errLog.log'
  );

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      status: err.statusCode,
      errors: err.generateErrors(),
    });
  } else if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      status: err.statusCode,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      status: 500,
    });
  }
};
