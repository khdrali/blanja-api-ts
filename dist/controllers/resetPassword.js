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
exports.RequestResetPasswordControllers = void 0;
const uuid_1 = require("uuid");
const resetPassword_1 = require("../models/resetPassword");
const nodemailer_1 = require("../utils/nodemailer");
const RequestResetPasswordControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req === null || req === void 0 ? void 0 : req.body;
        const date = new Date();
        const token = (0, uuid_1.v4)();
        yield (0, resetPassword_1.RequestResetPasswordModels)({ email, token, created_at: date });
        res.json({
            valid: true,
            status: 200,
            message: "Check your email to Reset Password",
        });
        const subject = "Reset Password";
        const meesage = `<a href=http://localhost:3000/${token}>Click here</a> to reset password`;
        (0, nodemailer_1.sendMail)(email, subject, meesage);
    }
    catch (error) {
        res.json({
            valid: false,
            status: 500,
            message: error,
        });
    }
});
exports.RequestResetPasswordControllers = RequestResetPasswordControllers;
