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
exports.CreateUserControllers = exports.GetAllUserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../models/user");
dotenv_1.default.config();
const saltrounds = 10;
const GetAllUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resAllUser = yield (0, user_1.GetAllUserModels)();
        res.json({
            valid: true,
            status: 200,
            message: "Successfully Get Data",
            data: resAllUser,
        });
    }
    catch (error) {
        res.json({
            valid: false,
            status: 500,
            message: error,
            data: [],
        });
    }
});
exports.GetAllUserController = GetAllUserController;
const CreateUserControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, phone } = req.body;
        const checkEmail = yield (0, user_1.getUserByEmail)(email);
        if ((checkEmail === null || checkEmail === void 0 ? void 0 : checkEmail.length) >= 1) {
            res.json({
                valid: false,
                status: 401,
                message: "Email already exist",
            });
        }
        bcrypt_1.default.hash(password, saltrounds, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return {
                    valid: false,
                    status: 500,
                    message: "Authentication Failed",
                };
            }
            yield (0, user_1.CreateUserController)({
                username: username,
                email: email,
                password: hash,
                phone: phone,
            });
            res.json({
                valid: true,
                status: 200,
                message: "Successfully create account!, please check your email for verfication your account",
            });
        }));
    }
    catch (error) {
        res.json({
            valid: false,
            status: 500,
            message: error,
            data: [],
        });
    }
});
exports.CreateUserControllers = CreateUserControllers;
