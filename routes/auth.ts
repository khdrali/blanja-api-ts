import express from "express";
import {
  verifyOtpController,
  requestOtpController,
  login,
} from "../controllers/otp";
import {
  validateLogin,
  handleValidationErrors,
} from "../middlewares/validation";
import { RequestResetPasswordControllers } from "../controllers/resetPassword";

const authRoutes = express.Router();

authRoutes.post("/login", validateLogin, handleValidationErrors, login);
authRoutes.post("/request-otp", requestOtpController);
authRoutes.post("/verify-otp", verifyOtpController);
authRoutes.post("/reset-password", RequestResetPasswordControllers);

export default authRoutes;
