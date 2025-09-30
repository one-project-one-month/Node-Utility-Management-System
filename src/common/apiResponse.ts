import { Response } from 'express';

export function successResponse(
  res: Response,
  message: string = 'Successful',
  content: any = null,
  status: number = 200
) {
  return res.status(status).json({
    success: true,
    message,
    content,
    status,
  });
}
