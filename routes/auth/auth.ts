import express from "express";
import {
  verifyOtpController,
  requestOtpController,
  login,
} from "../../controllers/otp/otp";
import {
  validateLogin,
  handleValidationErrors,
} from "../../middlewares/validation";
import {
  RequestResetPasswordControllers,
  ChangeResetPasswordControllers,
} from "../../controllers/resetPassword/resetPassword";

const authRoutes = express.Router();

authRoutes.post("/login", validateLogin, handleValidationErrors, login);
authRoutes.post("/request-otp", requestOtpController);
authRoutes.post("/verify-otp", verifyOtpController);
authRoutes.post("/reset-password", RequestResetPasswordControllers);
authRoutes.post("/change-password", ChangeResetPasswordControllers);

export default authRoutes;
