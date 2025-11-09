import { Request, Response, NextFunction } from 'express';
import { contractTypeAnalyticsService, roomAnalyticsService } from '../services/analyticsServices';
import { successResponse } from '../common/apiResponse';

export const contractTypeAnalyticsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const contracts = await contractTypeAnalyticsService();
    successResponse(
      res,
      'Contract type analytics fetched successfully',
      { data: contracts },
      200
    );
  } catch (error) {
    return next(error);
  }
};

export const roomAnalyticsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roomData = await roomAnalyticsService();
    successResponse(
      res,
      'Room analytics fetched successfully',
      { data: roomData },
      200
    );
  } catch (error) {
    return next(error);
  }
};
