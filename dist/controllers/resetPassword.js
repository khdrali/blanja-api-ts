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
exports.ChangeResetPasswordControllers = exports.RequestResetPasswordControllers = void 0;
const uuid_1 = require("uuid");
const resetPassword_1 = require("../models/resetPassword");
const nodemailer_1 = require("../utils/nodemailer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const sendResponse_1 = require("../utils/sendResponse");
const saltrounds = 10;
const RequestResetPasswordControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req === null || req === void 0 ? void 0 : req.body;
        const date = new Date();
        const token = (0, uuid_1.v4)();
        yield (0, resetPassword_1.RequestResetPasswordModels)({ email, token, created_at: date });
        (0, sendResponse_1.sendResponse)(res, 200, true, "Check your email to reset password");
        const subject = "Reset Password";
        const meesage = `<a href=http://localhost:3000/reset-password?token=${token}>Click here</a> to reset password`;
        (0, nodemailer_1.sendMail)(email, subject, meesage);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Internal server error");
    }
});
exports.RequestResetPasswordControllers = RequestResetPasswordControllers;
const ChangeResetPasswordControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { new_password, confirm_password } = req.body;
        const { token } = req === null || req === void 0 ? void 0 : req.query;
        if (new_password !== confirm_password) {
            (0, sendResponse_1.sendResponse)(res, 400, false, "Password & Confirm password doesn't match");
            return;
        }
        if (typeof token !== "string" || !token) {
            (0, sendResponse_1.sendResponse)(res, 400, false, "Invalid token format");
            return;
        }
        const checkTokenUser = yield (0, resetPassword_1.GetDataResetPasswordModels)(token);
        if (!checkTokenUser || checkTokenUser.length === 0) {
            (0, sendResponse_1.sendResponse)(res, 404, false, "Invalid Token");
            return;
        }
        const { user_id, is_used, created_at } = checkTokenUser[0];
        if (is_used) {
            (0, sendResponse_1.sendResponse)(res, 400, false, "Token has already been used");
            return;
        }
        const expiredToken = new Date(created_at);
        expiredToken.setMinutes(expiredToken.getMinutes() + 10);
        if (new Date() > expiredToken) {
            (0, sendResponse_1.sendResponse)(res, 400, false, "Token Expired");
            return;
        }
        const hashPassword = yield bcrypt_1.default.hash(new_password, saltrounds);
        yield (0, user_1.ChangeResetPasswordModels)({
            new_password: hashPassword,
            id: user_id,
        });
        yield (0, resetPassword_1.ResetPasswordUsedModels)(token);
        (0, sendResponse_1.sendResponse)(res, 200, true, "Successfully Changed Password");
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false);
    }
});
exports.ChangeResetPasswordControllers = ChangeResetPasswordControllers;
