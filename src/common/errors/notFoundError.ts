import { CustomError } from './customError';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public message: string) {
    super(message);
  }

  generateErrors() {
    return [{ message: this.message }];
  }
}
