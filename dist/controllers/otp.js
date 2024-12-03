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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpController = exports.requestOtpController = exports.login = void 0;
const otp_1 = require("../models/otp");
const nodemailer_1 = require("../utils/nodemailer");
const otp_2 = require("../utils/otp");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_1 = require("../models/user");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { email, password } = req.body;
        const checkEmail = yield (0, user_1.getUserByEmail)(email);
        if (checkEmail.length === 0) {
            res.status(404).json({
                valid: false,
                status: 404,
                message: "Email not registered",
            });
            return; // Exit the function after sending the response
        }
        const checkUserActive = (_a = checkEmail.find((v) => v === null || v === void 0 ? void 0 : v.is_active)) === null || _a === void 0 ? void 0 : _a.is_active;
        if (checkUserActive) {
            const passwordMatch = yield bcrypt_1.default.compare(password, checkEmail[0].password);
            if (passwordMatch) {
                const token = jsonwebtoken_1.default.sign({
                    id: (_b = checkEmail[0]) === null || _b === void 0 ? void 0 : _b.id,
                    username: (_c = checkEmail[0]) === null || _c === void 0 ? void 0 : _c.username,
                    email: (_d = checkEmail[0]) === null || _d === void 0 ? void 0 : _d.email,
                    iat: Math.floor(Date.now() / 1000) - 30,
                }, String(process.env.SECRET_KEY), { expiresIn: "1h" });
                res.status(200).json({
                    valid: true,
                    status: 200,
                    message: "Login successfully",
                    data: { token: token },
                });
                return; // Exit the function after sending the response
            }
            else {
                res.status(400).json({
                    valid: false,
                    status: 400,
                    message: "Incorrect Email or Password",
                });
                return; // Exit the function after sending the response
            }
        }
        else {
            (_e = res === null || res === void 0 ? void 0 : res.status(400)) === null || _e === void 0 ? void 0 : _e.json({
                valid: false,
                status: 400,
                message: "Account not actived",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            valid: false,
            status: 500,
            message: error || "Internal server error",
        });
    }
});
exports.login = login;
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
