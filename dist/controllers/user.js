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
exports.ChangePasswordControllers = exports.UpdateUserProfileController = exports.GetUserByIdController = exports.CreateUserControllers = exports.GetAllUserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../models/user/user");
const sendResponse_1 = require("../utils/sendResponse");
dotenv_1.default.config();
const saltrounds = 10;
const GetAllUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;
        const resAllUser = yield (0, user_1.GetAllUserModels)({
            sort: "",
            limit: String(limit),
            offset: String(offset),
        });
        const totalPage = Math.ceil(resAllUser.total_rows / limit);
        const responseData = {
            limit: limit,
            page: page,
            sort: "",
            total_page: totalPage,
            total_rows: Number(resAllUser.total_rows),
            rows: resAllUser === null || resAllUser === void 0 ? void 0 : resAllUser.rows,
        };
        res
            .status(200)
            .json((0, sendResponse_1.sendResponsePaginate)(req, responseData, "Successfully Get Data", 200));
    }
    catch (error) {
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal Server Error", 500, "error"));
    }
});
exports.GetAllUserController = GetAllUserController;
const CreateUserControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, phone } = req.body;
        const files = req.files;
        const checkEmail = yield (0, user_1.getUserByEmail)(email);
        if ((checkEmail === null || checkEmail === void 0 ? void 0 : checkEmail.length) >= 1) {
            res
                .status(401)
                .json((0, sendResponse_1.errorResponse)(req, "Email Already Exist", 401, "Unauthorized"));
            return;
        }
        const image_Profile = files.photo
            ? `/uploads/images/${files.photo[0].filename}`
            : null;
        bcrypt_1.default.hash(password, saltrounds, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res
                    .status(500)
                    .json((0, sendResponse_1.errorResponse)(req, "Authentichation failed", 500, "error"));
                return;
            }
            yield (0, user_1.CreateUserController)({
                username: username,
                email: email,
                password: hash,
                phone: phone,
                photo: image_Profile,
            });
            res
                .status(200)
                .json((0, sendResponse_1.sendResponses)(req, "Successfully create account!, please check your email for verfication your account", "", 200));
        }));
    }
    catch (error) {
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal Server Error", 500, "error"));
    }
});
exports.CreateUserControllers = CreateUserControllers;
const GetUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        if (typeof id !== "string") {
            // sendResponse(res, 400, false, "ID parameter must be a string");
            res
                .status(400)
                .json((0, sendResponse_1.errorResponse)(req, "Params id is required", 400, "bad_request"));
            return;
        }
        const result = yield (0, user_1.GetUserByIdModels)(id);
        if (result && result.length > 0) {
            res
                .status(200)
                .json((0, sendResponse_1.sendResponses)(req, result, "Successfully Get User", 200));
            return;
        }
        else {
            // sendResponse(res, 404, false, "User Not Found", []);
            res
                .status(404)
                .json((0, sendResponse_1.errorResponse)(req, "User Not Found", 404, "not_found"));
        }
    }
    catch (error) {
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal Server Error", 500, "error"));
    }
});
exports.GetUserByIdController = GetUserByIdController;
const UpdateUserProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { username, phone } = req === null || req === void 0 ? void 0 : req.body;
        const files = req.files;
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        const image_Profile = files.photo
            ? `/uploads/images/${files.photo[0].filename}`
            : null;
        if (Number(id) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(400).json((0, sendResponse_1.errorResponse)(req, "Unathorized", 400, "error"));
            return;
        }
        const getUserId = yield (0, user_1.GetUserByIdModels)(id);
        if (!getUserId) {
            res.status(404).json((0, sendResponse_1.errorResponse)(req, "User Not Found", 404, "error"));
            return;
        }
        else {
            const UpdatedUser = yield (0, user_1.UpdateUserProfileModels)({
                username: !username || username == "" ? getUserId[0].username : username,
                phone: !phone || phone == "" ? getUserId[0].phone : phone,
                photo: !files ? getUserId[0].photo : image_Profile,
                id: Number(id),
            });
            res
                .status(200)
                .json((0, sendResponse_1.sendResponses)(req, null, "Successfuly update data", 200));
        }
    }
    catch (error) {
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal Server Error", 500, "error"));
    }
});
exports.UpdateUserProfileController = UpdateUserProfileController;
const ChangePasswordControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { old_password, new_password, confirm_password } = req === null || req === void 0 ? void 0 : req.body;
        const { id } = req.params;
        if (Number(id) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(400).json((0, sendResponse_1.errorResponse)(req, "Unathorized", 400, "error"));
            return;
        }
        const getUserId = yield (0, user_1.GetUserByIdModels)(id);
        if (!getUserId) {
            res.status(404).json((0, sendResponse_1.errorResponse)(req, "User Not Found", 404, "error"));
            return;
        }
        const checkOldPassword = yield bcrypt_1.default.compare(old_password, getUserId[0].password);
        if (!checkOldPassword) {
            res
                .status(400)
                .json((0, sendResponse_1.errorResponse)(req, "Current Password Incorrect", 400, "error"));
            return;
        }
        if (new_password !== confirm_password) {
            res
                .status(400)
                .json((0, sendResponse_1.errorResponse)(req, "Password & Confirm password doesn't match", 400, "error"));
            return;
        }
        const saltrounds = 10;
        const hashNewPassword = yield bcrypt_1.default.hash(new_password, saltrounds);
        yield (0, user_1.ChangePasswordModels)({
            id: Number(id),
            new_password: hashNewPassword,
        });
        res
            .status(200)
            .json((0, sendResponse_1.sendResponses)(req, null, "Successfully Update Password", 200));
    }
    catch (error) {
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal Server Error", 500, "error"));
    }
});
exports.ChangePasswordControllers = ChangePasswordControllers;
