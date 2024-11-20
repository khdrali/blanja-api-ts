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
exports.CreateUserController = exports.getUserByEmail = exports.GetAllUserModels = void 0;
const db_1 = __importDefault(require("../db"));
const GetAllUserModels = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `SELECT * FROM public.user`;
});
exports.GetAllUserModels = GetAllUserModels;
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
