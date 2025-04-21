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
exports.GetDataResetPasswordModels = exports.ResetPasswordUsedModels = exports.RequestResetPasswordModels = void 0;
const db_1 = __importDefault(require("../../db"));
const RequestResetPasswordModels = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `INSERT INTO public.reset_password(user_id,token,created_at) VALUES ((SELECT id FROM public.user WHERE email = ${data === null || data === void 0 ? void 0 : data.email}),${data === null || data === void 0 ? void 0 : data.token},${data === null || data === void 0 ? void 0 : data.created_at})`;
});
exports.RequestResetPasswordModels = RequestResetPasswordModels;
const ResetPasswordUsedModels = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `UPDATE reset_password SET is_used=true WHERE token=${token}`;
});
exports.ResetPasswordUsedModels = ResetPasswordUsedModels;
const GetDataResetPasswordModels = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `SELECT * FROM reset_password WHERE token=${token}`;
});
exports.GetDataResetPasswordModels = GetDataResetPasswordModels;
