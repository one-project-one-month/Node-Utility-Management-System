import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ValidationError } from '../common/errors';

type ValidateProps = {
  schema: z.Schema<any>;
  target: 'BODY' | 'PARAMS' | 'QUERY';
};

const validate = (props: ValidateProps) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Get the correct data source based on target
    const dataToValidate =
      props.target === 'BODY'
        ? req.body
        : props.target === 'PARAMS'
          ? req.params
          : req.query;

    const { success, error, data } = props.schema.safeParse(dataToValidate);

    if (!success) {
      const formattedErrors = error.issues.map((err) => ({
        path: err.path.join(', '),
        message: err.message,
      }));
      return next(new ValidationError(formattedErrors));
    }

    // Store validated data in the correct request property
    if (props.target === 'BODY') {
      req.validatedBody = data;
    } else if (props.target === 'PARAMS') {
      req.validatedParams = data;
    } else if (props.target === 'QUERY') {
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
