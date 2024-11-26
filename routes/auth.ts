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

const authRoutes = express.Router();

authRoutes.post("/login", validateLogin, handleValidationErrors, login);
authRoutes.post("/request-otp", requestOtpController);
authRoutes.post("/verify-otp", verifyOtpController);

export default authRoutes;
