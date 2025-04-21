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
const resetPassword_1 = require("../../models/resetPassword/resetPassword");
const nodemailer_1 = require("../../utils/nodemailer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../../models/user/user");
const sendResponse_1 = require("../../utils/sendResponse");
const saltrounds = 10;
const RequestResetPasswordControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req === null || req === void 0 ? void 0 : req.body;
        const date = new Date();
        const token = (0, uuid_1.v4)();
        yield (0, resetPassword_1.RequestResetPasswordModels)({ email, token, created_at: date });
        res
            .status(200)
            .json((0, sendResponse_1.sendResponses)(req, null, "Check your email to reset password", 200));
        const subject = "Reset Password";
        const meesage = `<a href=http://localhost:3000/reset-password?token=${token}>Click here</a> to reset password`;
        (0, nodemailer_1.sendMail)(email, subject, meesage);
    }
    catch (error) {
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal Server Error", 500, "error"));
    }
});
exports.RequestResetPasswordControllers = RequestResetPasswordControllers;
const ChangeResetPasswordControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { new_password, confirm_password } = req.body;
        const { token } = req === null || req === void 0 ? void 0 : req.query;
        if (new_password !== confirm_password) {
            res
                .status(400)
                .json((0, sendResponse_1.errorResponse)(req, "Password & Confirm password doesn't match", 400, "error"));
            return;
        }
        if (typeof token !== "string" || !token) {
            res
                .status(400)
                .json((0, sendResponse_1.errorResponse)(req, "Invalid token format", 400, "error"));
            return;
        }
        const checkTokenUser = yield (0, resetPassword_1.GetDataResetPasswordModels)(token);
        if (!checkTokenUser || checkTokenUser.length === 0) {
            res.status(404).json((0, sendResponse_1.errorResponse)(req, "Invalid Token", 404, "error"));
            return;
        }
        const { user_id, is_used, created_at } = checkTokenUser[0];
        if (is_used) {
            res
                .status(400)
                .json((0, sendResponse_1.errorResponse)(req, "Token has already been used", 400, "error"));
            return;
        }
        const expiredToken = new Date(created_at);
        expiredToken.setMinutes(expiredToken.getMinutes() + 10);
        if (new Date() > expiredToken) {
            res.status(400).json((0, sendResponse_1.errorResponse)(req, "Token Expired", 400, "error"));
            return;
        }
        const hashPassword = yield bcrypt_1.default.hash(new_password, saltrounds);
        yield (0, user_1.ChangeResetPasswordModels)({
            new_password: hashPassword,
            id: user_id,
        });
        yield (0, resetPassword_1.ResetPasswordUsedModels)(token);
        res
            .status(200)
            .json((0, sendResponse_1.sendResponses)(req, null, "Successfully Changed Password", 200));
    }
    catch (error) {
        res.status(500).json((0, sendResponse_1.errorResponse)(req, error, 500, "error"));
    }
});
exports.ChangeResetPasswordControllers = ChangeResetPasswordControllers;
