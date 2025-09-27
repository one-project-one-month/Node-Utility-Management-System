import { Router } from "express";
import {
  getUserController,
  createUserController,
} from "../controllers/userController";
import {
  validateRequestBody,
  validateRequestQuery,
} from "../middlewares/validationMiddlware";
import { CreateUserSchema, GetUserQuerySchema } from "../validations/userSchema";

const router = Router();

router.get("/", validateRequestQuery(GetUserQuerySchema), getUserController);
router.post("/", validateRequestBody(CreateUserSchema), createUserController);

export default router;
