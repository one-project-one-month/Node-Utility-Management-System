import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandlingMiddleware";

/* ROUTES */



dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

/* ROUTES */


app.use(errorHandler);

app.get("/", (_req: Request, res: Response) => {
  res.send("API is running!");
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
