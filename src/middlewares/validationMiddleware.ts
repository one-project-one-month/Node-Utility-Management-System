import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ValidationError } from '../common/errors';

type ValidateProps = {
  schema: z.Schema<any>;
  target: 'BODY' | 'PARAMS' | 'QUERY';
};

const validate = ({ schema, target }: ValidateProps) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Get the correct data source based on target
    const dataToValidate =
      target === 'BODY'
        ? req.body
        : target === 'PARAMS'
          ? req.params
          : req.query;

    const { success, error, data } = schema.safeParse(dataToValidate);

    if (!success) {
      const formattedErrors = error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return next(new ValidationError(formattedErrors));
    }

    // Store validated data in the correct request property
    if (target === 'BODY') {
      req.validatedBody = data;
    } else if (target === 'PARAMS') {
      req.validatedParams = data;
    } else if (target === 'QUERY') {
      req.validatedQuery = data;
    }
    next();
  };
};

export const validateRequestParams = (schema: z.Schema<any>) => {
  return validate({
    schema,
    target: 'PARAMS',
  });
};

export const validateRequestQuery = (schema: z.Schema<any>) => {
  return validate({
    schema,
    target: 'QUERY',
  });
};

export const validateRequestBody = (schema: z.Schema<any>) => {
  return validate({
    schema,
    target: 'BODY',
  });
};
