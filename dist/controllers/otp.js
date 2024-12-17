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
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_1 = require("../models/user");
const sendResponse_1 = require("../utils/sendResponse");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { email, password } = req.body;
        const checkEmail = yield (0, user_1.getUserByEmail)(email);
        if (checkEmail.length === 0) {
            (0, sendResponse_1.sendResponse)(res, 404, false, "Email not registred");
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
                (0, sendResponse_1.sendResponse)(res, 200, true, "Login Successfully", { token: token });
                return; // Exit the function after sending the response
            }
            else {
                (0, sendResponse_1.sendResponse)(res, 400, false, "Incorrect Email or Password");
                return; // Exit the function after sending the response
            }
        }
        else {
            (0, sendResponse_1.sendResponse)(res, 400, false, "Account not actived");
        }
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Internal server error");
    }
});
exports.login = login;
const requestOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const otp = (0, otp_2.generateOTP)();
        const uuid = (0, uuid_1.v4)();
        const date = new Date();
        yield (0, otp_1.requestOtpModels)({
            otp_code: otp,
            unique_code: uuid,
            email,
            created_at: date,
        });
        (0, sendResponse_1.sendResponse)(res, 200, true, "Check your email to verify your account");
        const subject = "Email Verification";
        const message = `Your OTP code is: ${otp}`;
        (0, nodemailer_1.sendMail)(email, subject, message);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Internal Server Error");
    }
});
exports.requestOtpController = requestOtpController;
const verifyOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp_code, unique_code, email } = req.body;
    try {
        if (!otp_code || !email) {
            (0, sendResponse_1.sendResponse)(res, 400, false, "OTP code and email are required");
            return;
        }
        const otpResult = yield (0, otp_1.verifyOtp)({ otp_code, unique_code, email });
        if (otpResult.length === 0) {
            (0, sendResponse_1.sendResponse)(res, 400, false, "Invalid OTP");
            return;
        }
        const { user_id, created_at } = otpResult[0];
        const expirationTime = new Date(created_at);
        expirationTime.setMinutes(expirationTime.getMinutes() + 5);
        if (new Date() > expirationTime) {
            (0, sendResponse_1.sendResponse)(res, 400, false, "OTP has expired");
            return;
        }
        const isActive = yield (0, user_1.checkUserActive)(user_id);
        if (isActive) {
            (0, sendResponse_1.sendResponse)(res, 400, false, "Account is already active");
            return;
        }
        yield (0, user_1.UpdateUserActive)(user_id);
        yield (0, otp_1.updateOtpUsed)(otp_code);
        (0, sendResponse_1.sendResponse)(res, 200, true, "Account has been successfully actived");
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Internal server error");
    }
});
exports.verifyOtpController = verifyOtpController;
