"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validateLogin = exports.validateCreate = void 0;
const express_validator_1 = require("express-validator");
const sendResponse_1 = require("../utils/sendResponse");
exports.validateCreate = [
    (0, express_validator_1.body)("username").notEmpty().withMessage("username is required"),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("format must be email"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
        .withMessage("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"),
    (0, express_validator_1.body)("phone")
        .notEmpty()
        .withMessage("phone is required")
        .isNumeric()
        .withMessage("phone must be a number"),
];
exports.validateLogin = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("format must be email"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
        .withMessage("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"),
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => {
            // Ensure type safety by narrowing the error type
            return error === null || error === void 0 ? void 0 : error.msg;
        });
        res
            .status(400)
            .json((0, sendResponse_1.errorResponse)(req, String(errorMessages), 400, "error"));
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
