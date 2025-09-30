import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ValidationError } from '../common/errors';

type ValidateProps = {
  schema: z.Schema<any>;
  target: 'BODY' | 'PARAMS' | 'QUERY';
};

const validate = (props: ValidateProps) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { schema, target } = props;

    // Get the correct data source based on target
    const dataToValidate =
      target === 'BODY'
        ? req.body
        : target === 'PARAMS'
          ? req.params
          : req.query;

    const validation = schema.safeParse(dataToValidate);

    if (!validation.success) {
      console.log('Validation Errors:', validation.error.issues);
      const formattedErrors = validation.error.issues.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      return next(new ValidationError(formattedErrors));
    }

    // Store validated data in the correct request property
    if (target === 'BODY') {
      req.validatedBody = validation.data;
    } else if (target === 'PARAMS') {
      req.validatedParams = validation.data;
    } else if (target === 'QUERY') {
      req.validatedQuery = validation.data;
    }

    next();
  };
};

const validateRequestParams = (schema: z.Schema<any>) => {
  return validate({
    schema,
    target: 'PARAMS',
  });
};

const validateRequestQuery = (schema: z.Schema<any>) => {
  return validate({
    schema,
    target: 'QUERY',
  });
};

const validateRequestBody = (schema: z.Schema<any>) => {
  return validate({
    schema,
    target: 'BODY',
  });
};

export { validateRequestBody, validateRequestQuery, validateRequestParams };
