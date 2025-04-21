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
exports.updateOtpUsed = exports.verifyOtp = exports.requestOtpModels = void 0;
const db_1 = __importDefault(require("../../db"));
const requestOtpModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `INSERT INTO public.otp_request (otp_code, unique_code, user_id, created_at) 
  VALUES (${params === null || params === void 0 ? void 0 : params.otp_code},${params === null || params === void 0 ? void 0 : params.unique_code}, 
    (SELECT id FROM public.user WHERE email = ${params === null || params === void 0 ? void 0 : params.email}), ${params === null || params === void 0 ? void 0 : params.created_at}
  )`;
});
exports.requestOtpModels = requestOtpModels;
const verifyOtp = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.default) `
      SELECT otp_request.user_id, otp_request.created_at 
      FROM otp_request
      JOIN "user" ON otp_request.user_id = "user".id 
      WHERE otp_request.otp_code = ${params === null || params === void 0 ? void 0 : params.otp_code}
        AND otp_request.unique_code=${params === null || params === void 0 ? void 0 : params.unique_code} 
        AND "user".email = ${params === null || params === void 0 ? void 0 : params.email} 
        AND otp_request.is_used = false
    `;
    return result;
});
exports.verifyOtp = verifyOtp;
const updateOtpUsed = (otp_code) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `
    UPDATE otp_request
    SET is_used = true
    WHERE otp_code = ${otp_code}
  `;
});
exports.updateOtpUsed = updateOtpUsed;
