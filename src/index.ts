import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandlingMiddleware';
import userRoute from './routes/userRoute'

dotenv.config();

const app = express();

const port = process.env.PORT;

// GLOBAL MIDDLEWARES
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ROUTES */
app.use("/api/v1/users", userRoute)


// ERROR HANDLER MUST BE THE LAST MIDDLEWARE
app.use(errorHandler);

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running!');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
