import { Router } from "express";
import {
  getAllUsersController,
  getUserController,
  createUserController,
} from "../controllers/userController";
import {
  validateRequestBody,
  validateRequestParams,
} from "../middlewares/validationMiddlware";
import { CreateUserSchema, GetUserParamSchema } from "../validations/userSchema";

const router = Router();

router.get("/", getAllUsersController);
router.get("/:userId", validateRequestParams(GetUserParamSchema) ,getUserController);
router.post("/",validateRequestBody(CreateUserSchema), createUserController);

export default router;