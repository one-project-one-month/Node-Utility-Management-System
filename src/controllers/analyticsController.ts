import { Request, Response, NextFunction } from 'express';
import { contractTypeAnalyticsService } from '../services/analyticsServices';
import { successResponse } from '../common/apiResponse';

// @
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
      contracts,
      200
    );
  } catch (error) {
    return next(error);
  }
};
