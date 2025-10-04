import { CustomError } from './customError';

export class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor(public message: string) {
    super(message);
  }

  generateErrors() {
    return [{ message: this.message }];
  }
}
