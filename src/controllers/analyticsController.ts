import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  getBillRevenueByFourMonthService,
  getBillStatusAnalyticsService,
} from '../services/analyticsServices';
import { get } from 'http';

export const billStatusAnalyticsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const analyticsData = await getBillStatusAnalyticsService(req);
    successResponse(
      res,
      'Bill History fetched successfully',
      { data: analyticsData },
      200
    );
  } catch (error) {
    return next(error);
  }
};

export const billsRevenueByMonthController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const revenueData = await getBillRevenueByFourMonthService(req);
    successResponse(
      res,
      'Bill History fetched successfully',
      { data: revenueData },
      200
    );
  } catch (error) {
    return next(error);
  }
};
