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
exports.GetUserByIdController = exports.CreateUserControllers = exports.GetAllUserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../models/user");
const sendResponse_1 = require("../utils/sendResponse");
dotenv_1.default.config();
const saltrounds = 10;
const GetAllUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resAllUser = yield (0, user_1.GetAllUserModels)();
        (0, sendResponse_1.sendResponse)(res, 200, true, "Successfully Get Data", resAllUser);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Internal server error", []);
    }
});
exports.GetAllUserController = GetAllUserController;
const CreateUserControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, phone } = req.body;
        const checkEmail = yield (0, user_1.getUserByEmail)(email);
        if ((checkEmail === null || checkEmail === void 0 ? void 0 : checkEmail.length) >= 1) {
            (0, sendResponse_1.sendResponse)(res, 401, false, "Email already exist");
        }
        bcrypt_1.default.hash(password, saltrounds, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                (0, sendResponse_1.sendResponse)(res, 500, false, "Authentication Failed");
            }
            yield (0, user_1.CreateUserController)({
                username: username,
                email: email,
                password: hash,
                phone: phone,
            });
            (0, sendResponse_1.sendResponse)(res, 200, true, "Successfully create account!, please check your email for verfication your account");
        }));
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Internal server error", []);
    }
});
exports.CreateUserControllers = CreateUserControllers;
const GetUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        if (typeof id !== "string") {
            (0, sendResponse_1.sendResponse)(res, 400, false, "ID parameter must be a string");
        }
        const result = yield (0, user_1.GetUserByIdModels)(id);
        if (result && result.length > 0) {
            (0, sendResponse_1.sendResponse)(res, 200, true, "Successfully Get User", result);
        }
        else {
            (0, sendResponse_1.sendResponse)(res, 404, false, "User Not Found", []);
        }
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Internal server error", []);
    }
});
exports.GetUserByIdController = GetUserByIdController;
