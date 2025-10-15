import { CustomError } from './customError';

interface ValidationErrorDetail {
  path: string;
  message: string;
}

export class ValidationError extends CustomError {
  statusCode = 400;

  constructor(public details: ValidationErrorDetail[]) {
    super('Validation Error');
  }

  generateErrors() {
    return this.details.map((detail) => ({
      message: detail.message,
      field: detail.path,
    }));
  }
}
