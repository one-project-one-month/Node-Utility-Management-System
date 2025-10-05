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
import receiptRoute from './routes/receiptRoute';
import serviceRoute from './routes/serviceRoute';
import tenantRoute from './routes/tenantRoute';
import userRoute from './routes/userRoute';
import { deployedUrls } from './common/auth/allowedOrigins';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

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
app.use('/api/v1/tenants', isAuthenticated, tenantRoute); //tenant endpoint
app.use('/api/v1', isAuthenticated, serviceRoute)  //customer service end point
app.use('/api/v1', receiptRoute);

// ERROR HANDLER MUST BE THE LAST MIDDLEWARE
app.use(errorHandler);

app.get('/', (_req: Request, res: Response) => {
   const docsLinks = deployedUrls.map((url) => `${url}/docs`);

    res.json({
      message: '🚀 API is running successfully!',
      documentation: docsLinks,
    });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
