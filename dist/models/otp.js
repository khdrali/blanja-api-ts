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
exports.requestOtp = void 0;
const db_js_1 = __importDefault(require("../db.js"));
const requestOtp = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_js_1.default) `INSERT INTO public.otp_request (otp_code, unique_code, user_id, created_at) 
  VALUES (${params === null || params === void 0 ? void 0 : params.otp_code}, ${params === null || params === void 0 ? void 0 : params.unique_code}, 
    (SELECT id FROM public.user WHERE email = ${params === null || params === void 0 ? void 0 : params.email}), ${params === null || params === void 0 ? void 0 : params.created_at}
  )`;
});
exports.requestOtp = requestOtp;
