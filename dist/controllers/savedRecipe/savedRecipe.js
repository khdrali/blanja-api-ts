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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSavedRecipeByUserController = exports.savedRecipeController = void 0;
const sendResponse_1 = require("../../utils/sendResponse");
const savedRecipe_1 = require("../../models/savedRecipe/savedRecipe");
const savedRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { recipe_id } = req === null || req === void 0 ? void 0 : req.body;
        const user_Id = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0;
        if (!user_Id || user_Id === 0) {
            res.status(401).json((0, sendResponse_1.errorResponse)(req, "Unauthorized", 401, "error"));
            return;
        }
        if (recipe_id === 0) {
            res === null || res === void 0 ? void 0 : res.status(400).json((0, sendResponse_1.errorResponse)(req, "Failed To Saved Recipe", 400, "error"));
            return;
        }
        const SavedParams = {
            recipe_id: recipe_id,
            user_id: user_Id,
        };
        const CreateSaved = yield (0, savedRecipe_1.CreateSavedRecipeModels)(SavedParams);
        const message = CreateSaved.is_saved
            ? "You Saved the Recipe"
            : "You Unsaved the Recipe";
        res.status(200).json((0, sendResponse_1.sendResponses)(req, null, message, 200));
    }
    catch (error) {
        console.log(error);
        res === null || res === void 0 ? void 0 : res.status(500).json((0, sendResponse_1.errorResponse)(req, "Internal Server Error", 500, "error"));
    }
});
exports.savedRecipeController = savedRecipeController;
const GetSavedRecipeByUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const limit = 10;
        const page = Number(req === null || req === void 0 ? void 0 : req.query.page) || 1;
        const offset = (page - 1) * limit;
        const search = (req === null || req === void 0 ? void 0 : req.query.search) || "";
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(403).json((0, sendResponse_1.errorResponse)(req, "Unauthorized", 403, "error"));
            return;
        }
        const result = yield (0, savedRecipe_1.GetSavedRecipeByUserModels)({ limit: String(limit), offset: String(offset), sort: "" }, userId, search);
        const total_page = Math.ceil(result.total_rows / limit);
        const responseData = {
            limit,
            page,
            sort: "",
            total_page,
            total_rows: Number(result === null || result === void 0 ? void 0 : result.total_rows),
            rows: result === null || result === void 0 ? void 0 : result.rows,
        };
        res
            .status(200)
            .json((0, sendResponse_1.sendResponsePaginate)(req, responseData, "Successfully Get Recipe", 200));
    }
    catch (error) {
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal server error", 500, "error"));
    }
});
exports.GetSavedRecipeByUserController = GetSavedRecipeByUserController;
