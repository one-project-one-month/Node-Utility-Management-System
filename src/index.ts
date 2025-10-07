import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerDocs from './config/swagger';
import { customLogger } from './common/utils/customLogger';
import { errorHandler } from './middlewares/errorHandlingMiddleware';
import { isAuthenticated } from './middlewares/authMiddleware';

// ROUTE IMPORTS
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import serviceRoute from './routes/serviceRoute';
import billRoute from './routes/billRoute';
import tanentBillRoute from './routes/tanentBillRoute';

dotenv.config();

const app = express();

const port = process.env.PORT;

// GLOBAL MIDDLEWARES
app.use(customLogger('API_Logger'));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API DOCUMENTATION
swaggerDocs(app, port || 3000);

// ROUTES
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', isAuthenticated, userRoute);
app.use('/api/v1/tenants', serviceRoute);
app.use('/api/v1/bills', isAuthenticated, billRoute);
app.use('/api/v1/tenants', isAuthenticated, tanentBillRoute);

// ERROR HANDLER MUST BE THE LAST MIDDLEWARE
app.use(errorHandler);

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running!');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
