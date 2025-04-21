"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponses = sendResponses;
exports.sendResponsePaginate = sendResponsePaginate;
exports.errorResponse = errorResponse;
// export const sendResponse = (
//   res: Response,
//   statusCode: number,
//   valid: boolean,
//   messageRes?: string,
//   data?: any
// ): void => {
//   res.status(statusCode).json({
//     valid,
//     status: statusCode,
//     message: messageRes ?? "Internal Server Error",
//     data,
//   });
// };
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
