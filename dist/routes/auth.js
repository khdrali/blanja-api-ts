"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const otp_1 = require("../controllers/otp");
const validation_1 = require("../middlewares/validation");
const authRoutes = express_1.default.Router();
authRoutes.post("/login", validation_1.validateLogin, validation_1.handleValidationErrors, otp_1.login);
authRoutes.post("/request-otp", otp_1.requestOtpController);
authRoutes.post("/verify-otp", otp_1.verifyOtpController);
exports.default = authRoutes;
