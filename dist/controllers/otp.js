"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpController = exports.requestOtpController = void 0;
const otp_1 = require("../models/otp");
const nodemailer_1 = require("../utils/nodemailer");
const otp_2 = require("../utils/otp");
const user_1 = require("../models/user");
const requestOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const otp = (0, otp_2.generateOTP)();
        const date = new Date();
        yield (0, otp_1.requestOtpModels)({
            otp_code: otp,
            email,
            created_at: date,
        });
        res.json({
            valid: true,
            status: 200,
            message: "Check your email to verify your account",
        });
        const subject = "Email Verification";
        const message = `Your OTP code is: ${otp}`;
        (0, nodemailer_1.sendMail)(email, subject, message);
    }
    catch (error) {
        res.json({
            valid: false,
            status: 500,
            message: error,
            data: [],
        });
    }
});
exports.requestOtpController = requestOtpController;
const verifyOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp_code, email } = req.body;
    try {
        if (!otp_code || !email) {
            res.status(400).json({
                valid: false,
                status: 400,
                message: "OTP code and email are required",
            });
            return;
        }
        const otpResult = yield (0, otp_1.verifyOtp)({ otp_code, email });
        if (otpResult.length === 0) {
            res.status(400).json({
                valid: false,
                status: 400,
                message: "Invalid OTP",
            });
            return;
        }
        const { user_id, created_at } = otpResult[0];
        const expirationTime = new Date(created_at);
        expirationTime.setMinutes(expirationTime.getMinutes() + 5);
        if (new Date() > expirationTime) {
            res.status(400).json({
                valid: false,
                status: 400,
                message: "OTP has expired",
            });
            return;
        }
        const isActive = yield (0, user_1.checkUserActive)(user_id);
        if (isActive) {
            res.status(400).json({
                valid: false,
                status: 400,
                message: "Account is already active",
            });
            return;
        }
        yield (0, user_1.UpdateUserActive)(user_id);
        yield (0, otp_1.updateOtpUsed)(otp_code);
        res.status(200).json({
            valid: true,
            status: 200,
            message: "Account has been successfully activated",
        });
    }
    catch (error) {
        console.error("Error in verifyOtpController:", error);
        res.status(500).json({
            valid: false,
            status: 500,
            message: "Internal server error",
        });
    }
});
exports.verifyOtpController = verifyOtpController;
