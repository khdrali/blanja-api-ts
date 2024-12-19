"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
exports.sendResponses = sendResponses;
exports.sendResponsePaginate = sendResponsePaginate;
exports.errorResponse = errorResponse;
const sendResponse = (res, statusCode, valid, messageRes, data) => {
    res.status(statusCode).json({
        valid,
        status: statusCode,
        message: messageRes !== null && messageRes !== void 0 ? messageRes : "Internal Server Error",
        data,
    });
};
exports.sendResponse = sendResponse;
function sendResponses(req, data, message, statusCode) {
    return {
        details: {
            path: req.originalUrl,
            query: req.query,
            status_code: statusCode,
            method: req.method,
            status: "success",
        },
        valid: true,
        data,
        error: null,
        message,
    };
}
function sendResponsePaginate(req, data, message, statusCode) {
    return {
        details: {
            path: req.originalUrl,
            query: req.query,
            status_code: statusCode,
            method: req.method,
            status: "success",
        },
        valid: true,
        data,
        errors: null,
        message,
    };
}
function errorResponse(req, message, statusCode, statusMsg) {
    return {
        details: {
            path: req.originalUrl,
            query: req.query,
            status_code: statusCode,
            method: req.method,
            status: statusMsg,
        },
        valid: false,
        data: null,
        error: null,
        message: message,
    };
}
