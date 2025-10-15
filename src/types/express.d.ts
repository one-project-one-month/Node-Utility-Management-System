import 'express';
import { TokenPayload } from '../common/auth/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;

      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
    }
  }
}
