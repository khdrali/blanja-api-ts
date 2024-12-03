import express from "express";
import {
  GetAllUserController,
  CreateUserControllers,
  GetUserByIdController,
} from "../controllers/user";

import {
  validateCreate,
  handleValidationErrors,
} from "../middlewares/validation";
import { validateToken } from "../middlewares/validate-token";

const router = express.Router();

router.get("/", validateToken, GetAllUserController)
router.get("/user/:id",validateToken, GetUserByIdController)
router.post(
  "/add",
  validateCreate,
  handleValidationErrors,
  CreateUserControllers
);

export default router;
