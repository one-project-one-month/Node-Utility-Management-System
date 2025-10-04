import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerDocs from './config/swagger';
import { customLogger } from './common/utils/customLogger';
import { crediential } from './common/auth/credential';
import corsOptions from './common/auth/corsOptions';
import { errorHandler } from './middlewares/errorHandlingMiddleware';
import { isAuthenticated } from './middlewares/authMiddleware';

// ROUTE IMPORTS
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import serviceRoute from './routes/serviceRoute'
import receiptRoute from './routes/receiptRoute';

dotenv.config();

const app = express();

const port = process.env.PORT;

// GLOBAL MIDDLEWARES
app.use(customLogger('API_Logger'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1 /* number of proxies between user and server */) // To solve 'X-Forwarded-For' header error in production
app.use(crediential);
app.use(cors(corsOptions));

// API DOCUMENTATION
swaggerDocs(app, port || 3000);

// ROUTES
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', isAuthenticated, userRoute);
app.use('/api/v1', serviceRoute)  //customer service end point
app.use('/api/v1', receiptRoute);

// ERROR HANDLER MUST BE THE LAST MIDDLEWARE
app.use(errorHandler);

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running!');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
