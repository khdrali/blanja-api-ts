"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validateLogin = exports.validateCreate = void 0;
const express_validator_1 = require("express-validator");
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
            var _a;
            // Ensure type safety by narrowing the error type
            const param = (_a = error.param) !== null && _a !== void 0 ? _a : "unknown_field";
            return { [param]: error.msg };
        });
        res.status(400).json({
            valid: false,
            status: 400,
            message: errorMessages,
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;