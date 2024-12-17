"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, valid, messageRes, data) => {
    res.status(statusCode).json({
        valid,
        status: statusCode,
        message: messageRes !== null && messageRes !== void 0 ? messageRes : "Internal Server Error",
        data,
    });
};
exports.sendResponse = sendResponse;
