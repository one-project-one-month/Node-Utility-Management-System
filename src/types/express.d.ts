import 'express';
import { TokenPayload } from '../common/auth/jwtToken';

declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
      user?: TokenPayload;
    }
  }
}