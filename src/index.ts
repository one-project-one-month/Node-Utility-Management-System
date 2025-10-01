import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import swaggerDocs from './config/swagger';
import { errorHandler } from './middlewares/errorHandlingMiddleware';
import tenantRoute from './routes/tenantRoute';

// ROUTE IMPORTS
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';

dotenv.config();

const app = express();

const port = process.env.PORT;

// GLOBAL MIDDLEWARES
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ROUTES */
app.use('/api/v1/tenants', tenantRoute);
// API DOCUMENTATION
swaggerDocs(app, port || 3000);

// ROUTES
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);

// ERROR HANDLER MUST BE THE LAST MIDDLEWARE
app.use(errorHandler);

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running!');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
