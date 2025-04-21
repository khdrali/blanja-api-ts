import express from "express";
import {
  GetAllUserController,
  CreateUserControllers,
  GetUserByIdController,
  UpdateUserProfileController,
  ChangePasswordControllers,
} from "../../controllers/user/user";

import {
  validateCreate,
  handleValidationErrors,
} from "../../middlewares/validation";
import { validateToken } from "../../middlewares/validate-token";
import upload from "../../middlewares/multerConfig";

const router = express.Router();

router.get("/", validateToken, GetAllUserController);
router.get("/user/:id", validateToken, GetUserByIdController);
router.post(
  "/add",
  upload.fields([{ name: "photo", maxCount: 1 }]),
  validateCreate,
  handleValidationErrors,
  CreateUserControllers
);

router.patch(
  "/update/:id",
  upload.fields([{ name: "photo", maxCount: 1 }]),
  validateToken,
  UpdateUserProfileController
);
router.patch("/change-password/:id", validateToken, ChangePasswordControllers);

export default router;
