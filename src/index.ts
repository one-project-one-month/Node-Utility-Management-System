import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import corsOptions from './common/auth/corsOptions';
import { crediential } from './common/auth/credential';
import { customLogger } from './common/utils/customLogger';
import swaggerDocs from './config/swagger';
import { hasRole, isAuthenticated } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorHandlingMiddleware';
import { deployedUrls } from './common/auth/allowedOrigins';

// ROUTE IMPORTS
import authRoute from './routes/authRoute';
import receiptRoute from './routes/receiptRoute';
import serviceRoute from './routes/serviceRoute';
import tenantRoute from './routes/tenantRoute';
import userRoute from './routes/userRoute';
import billRoute from './routes/billRoute';
import contractTypeRoute from './routes/contractTypeRoute';
import totalUnitsRoute from './routes/totalUnitsRoute';
import contractRoute from './routes/contractRoute';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

// GLOBAL MIDDLEWARES
app.use(customLogger('API_Logger'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1 /* number of proxies between user and server */); // To solve 'X-Forwarded-For' header error in production
app.use(crediential);
app.use(cors(corsOptions));

// API DOCUMENTATION
swaggerDocs(app, port || 3000);

// ROUTES
app.use('/api/v1/auth', authRoute);

app.use('/api/v1/users', isAuthenticated, userRoute); // user endpoint
app.use('/api/v1/tenants', serviceRoute);
app.use('/api/v1/tenants', isAuthenticated, tenantRoute); //tenant endpoint
app.use('/api/v1/total-units', isAuthenticated, totalUnitsRoute); //total-units endpoint
app.use('/api/v1', isAuthenticated, billRoute);
app.use('/api/v1', isAuthenticated, serviceRoute); //customer service end point
app.use('/api/v1', isAuthenticated, receiptRoute); //receipt endpoint
//tenant endpoint
app.use(
  '/api/v1/total-units',
  isAuthenticated,
  hasRole(['Admin', 'Staff']),
  totalUnitsRoute
); //total-units endpoint
app.use('/api/v1/contract-types', isAuthenticated, contractTypeRoute); // contract type endpoint
app.use('/api/v1', isAuthenticated, contractRoute); // contract endpoint

// ERROR HANDLER MUST BE THE LAST MIDDLEWARE
app.use(errorHandler);

app.get('/', (_req: Request, res: Response) => {
  const docsLinks = deployedUrls.map((url) => `${url}/docs`);

  res.json({
    message: '🚀 API is running successfully!',
    documentation: docsLinks,
  });
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
