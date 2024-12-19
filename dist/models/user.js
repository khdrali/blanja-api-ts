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
exports.UpdateUserProfileModels = exports.ChangeResetPasswordModels = exports.UpdateUserActive = exports.checkUserActive = exports.CreateUserController = exports.getUserByEmail = exports.GetUserByIdModels = exports.GetAllUserModels = void 0;
const db_1 = __importDefault(require("../db"));
const GetAllUserModels = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Query untuk mengambil data user
    const query = `${data.sort} LIMIT ${data === null || data === void 0 ? void 0 : data.limit} OFFSET ${data === null || data === void 0 ? void 0 : data.offset}`;
    const users = yield (0, db_1.default) `SELECT * FROM public.user ORDER BY ${query}`;
    // Query untuk menghitung total rows
    const countResult = yield (0, db_1.default) `SELECT COUNT(*) AS total_rows FROM public.user `;
    return {
        total_rows: ((_a = countResult[0]) === null || _a === void 0 ? void 0 : _a.total_rows) || 0,
        rows: users,
    };
});
exports.GetAllUserModels = GetAllUserModels;
const GetUserByIdModels = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `SELECT * FROM public.user WHERE id = ${id}`;
});
exports.GetUserByIdModels = GetUserByIdModels;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `SELECT * FROM public.user WHERE email=${email}`;
});
exports.getUserByEmail = getUserByEmail;
const CreateUserController = (params) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(params === null || params === void 0 ? void 0 : params.photo)) {
        return yield (0, db_1.default) `INSERT INTO public.user(username,email,password,phone) VALUES (${params === null || params === void 0 ? void 0 : params.username},${params === null || params === void 0 ? void 0 : params.email},${params === null || params === void 0 ? void 0 : params.password},${params === null || params === void 0 ? void 0 : params.phone})`;
    }
    else {
        return yield (0, db_1.default) `INSERT INTO public.user(username,email,password,phone,photo) VALUES (${params === null || params === void 0 ? void 0 : params.username},${params === null || params === void 0 ? void 0 : params.email},${params === null || params === void 0 ? void 0 : params.password},${params === null || params === void 0 ? void 0 : params.phone},${params === null || params === void 0 ? void 0 : params.photo})`;
    }
});
exports.CreateUserController = CreateUserController;
const checkUserActive = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield (0, db_1.default) `SELECT public.user.is_active FROM public.user WHERE id=${user_id}`;
    return (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.is_active) !== null && _b !== void 0 ? _b : false;
});
exports.checkUserActive = checkUserActive;
const UpdateUserActive = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `
    UPDATE public.user
    SET is_active = true
    WHERE id = ${user_id}
  `;
});
exports.UpdateUserActive = UpdateUserActive;
const ChangeResetPasswordModels = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `UPDATE public.user SET password=${data === null || data === void 0 ? void 0 : data.new_password} WHERE id=${data === null || data === void 0 ? void 0 : data.id}`;
});
exports.ChangeResetPasswordModels = ChangeResetPasswordModels;
const UpdateUserProfileModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `UPDATE public.user SET username=${params === null || params === void 0 ? void 0 : params.username}, phone=${params === null || params === void 0 ? void 0 : params.phone} WHERE id=${params === null || params === void 0 ? void 0 : params.id}`;
});
exports.UpdateUserProfileModels = UpdateUserProfileModels;
