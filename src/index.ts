import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import corsOptions from './common/auth/corsOptions';
import { crediential } from './common/auth/credential';
import { customLogger } from './common/utils/customLogger';
import swaggerDocs from './config/swagger';
import { isAuthenticated } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorHandlingMiddleware';

// ROUTE IMPORTS
import authRoute from './routes/authRoute';

// ROUTE IMPORTS

import receiptRoute from './routes/receiptRoute';
import serviceRoute from './routes/serviceRoute';

import tenantRoute from './routes/tenantRoute';
import userRoute from './routes/userRoute';

dotenv.config();

const app = express();

const port = process.env.PORT;

// GLOBAL MIDDLEWARES
app.use(customLogger('API_Logger'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(crediential);
app.use(cors(corsOptions));

// API DOCUMENTATION
swaggerDocs(app, port || 3000);

// ROUTES
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', isAuthenticated, userRoute);
app.use('/api/v1/tenants', isAuthenticated, tenantRoute); //tenant endpoint
app.use('/api/v1', isAuthenticated, serviceRoute); //customer service end point

app.use('/api/v1/receipts', receiptRoute);

// Receipt
app.use('/api/v1', receiptRoute);
// app.use('/api/v1/tenants/:tenantId/receipts/latest', receiptRoute);
// app.use('/api/v1/tenants/:tenantId/receipts/history', receiptRoute);

// ERROR HANDLER MUST BE THE LAST MIDDLEWARE
app.use(errorHandler);

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running!');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
