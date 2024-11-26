import express from "express";
import {
  GetAllUserController,
  CreateUserControllers,
} from "../controllers/user";

import {
  validateCreate,
  handleValidationErrors,
} from "../middlewares/validation";
import { validateToken } from "../middlewares/validate-token";

const router = express.Router();

router.get("/", validateToken, GetAllUserController);
router.post(
  "/add",
  validateCreate,
  handleValidationErrors,
  CreateUserControllers
);

export default router;
