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
exports.UpdateUserProfileController = exports.GetUserByIdController = exports.CreateUserControllers = exports.GetAllUserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../models/user");
const sendResponse_1 = require("../utils/sendResponse");
dotenv_1.default.config();
const saltrounds = 10;
const GetAllUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;
        const resAllUser = yield (0, user_1.GetAllUserModels)({
            sort: "id DESC",
            limit: String(limit),
            offset: String(offset),
        });
        const totalPage = Math.ceil(resAllUser.total_rows / limit);
        const responseData = {
            limit: limit,
            page: page,
            sort: "id Desc",
            total_page: totalPage,
            total_rows: Number(resAllUser.total_rows),
            rows: resAllUser === null || resAllUser === void 0 ? void 0 : resAllUser.rows,
        };
        // sendResponse(res, 200, true, "Successfully Get Data", resAllUser);
        res
            .status(200)
            .json((0, sendResponse_1.sendResponses)(req, responseData, "Successfully Get Data", 200));
    }
    catch (error) {
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "error", 500, "Internal Server Error"));
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
            res
                .status(200)
                .json((0, sendResponse_1.sendResponses)(req, result, "Successfully Get User", 200));
        }
        else {
            // sendResponse(res, 404, false, "User Not Found", []);
            res
                .status(404)
                .json((0, sendResponse_1.errorResponse)(req, "User Not Found", 404, "Not Found"));
        }
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Internal server error", []);
    }
});
exports.GetUserByIdController = GetUserByIdController;
const UpdateUserProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { username, phone } = req === null || req === void 0 ? void 0 : req.body;
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        if (Number(id) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            (0, sendResponse_1.sendResponse)(res, 400, false, "Unauthorized");
        }
    }
    catch (error) { }
});
exports.UpdateUserProfileController = UpdateUserProfileController;
