import { Request, Response, NextFunction } from 'express';
import { successResponse } from '../common/apiResponse';
import {
  getBillRevenueByFourMonthService,
  getBillStatusAnalyticsService,
} from '../services/analyticsServices';
import {
  contractTypeAnalyticsService,
  roomAnalyticsService,
} from '../services/analyticsServices';

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
