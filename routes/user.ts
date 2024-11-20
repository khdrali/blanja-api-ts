import express from "express";
import {
  GetAllUserController,
  CreateUserControllers,
} from "../controllers/user";

import {
  validateCreate,
  handleValidationErrors,
} from "../middlewares/validation";

const router = express.Router();

router.get("/", GetAllUserController);
router.post(
  "/add",
  validateCreate,
  handleValidationErrors,
  CreateUserControllers
);

export default router;
