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
exports.GetCommentRecipeController = exports.DeleteCommentRecipeController = exports.CreateCommentRecipeController = void 0;
const recipe_1 = require("../../models/recipe/recipe");
const sendResponse_1 = require("../../utils/sendResponse");
const comment_1 = require("../../models/comment/comment");
const CreateCommentRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { comment, recipe_id } = req === null || req === void 0 ? void 0 : req.body;
        const userId = (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0;
        if (!userId || userId === 0) {
            res.status(403).json((0, sendResponse_1.errorResponse)(req, "Unauthorized", 403, "error"));
            return;
        }
        const resultRecipe = yield (0, recipe_1.GetRecipeByIdModels)({
            recipeId: recipe_id,
            userId,
        });
        if (resultRecipe.length === 0) {
            res
                .status(404)
                .json((0, sendResponse_1.errorResponse)(req, "Recipe Not Found", 403, "error"));
            return;
        }
        const dataComment = {
            comment,
            recipe_id,
            user_id: String(userId),
            created_at: new Date(),
        };
        if (!comment || comment == "") {
            res
                .status(400)
                .json((0, sendResponse_1.errorResponse)(req, "Comment not be empty", 400, "error"));
            return;
        }
        yield (0, comment_1.CreateCommentRecipeModels)(dataComment);
        res
            .status(200)
            .json((0, sendResponse_1.sendResponses)(req, null, "Successfully Added Comments", 200));
    }
    catch (error) {
        let message = "Internal Server Error";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(500).json((0, sendResponse_1.errorResponse)(req, message, 500, "error"));
    }
});
exports.CreateCommentRecipeController = CreateCommentRecipeController;
const DeleteCommentRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0;
        if (!userId) {
            res.status(403).json((0, sendResponse_1.errorResponse)(req, "Unauthorized", 403, "error"));
            return;
        }
        const deleted = yield (0, comment_1.DeleteCommentRecipeModels)({
            id: id,
            user_id: String(userId),
        });
        if (deleted.length === 0) {
            res
                .status(404)
                .json((0, sendResponse_1.errorResponse)(req, "Comment not found or not authorized", 404, "error"));
            return;
        }
        res
            .status(200)
            .json((0, sendResponse_1.sendResponses)(req, null, "Successfully Deleted Commnet", 200));
    }
    catch (error) {
        let message = "Internal Server Error";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(500).json((0, sendResponse_1.errorResponse)(req, message, 500, "error"));
    }
});
exports.DeleteCommentRecipeController = DeleteCommentRecipeController;
const GetCommentRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        const limit = 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(403).json((0, sendResponse_1.errorResponse)(req, "Unauthorized", 403, "error"));
            return;
        }
        const resultComment = yield (0, comment_1.GetCommentsByRecipeIdModels)(id, limit, offset);
        const totalPage = Math.ceil((resultComment === null || resultComment === void 0 ? void 0 : resultComment.total_rows) / limit);
        const responseData = {
            limit: limit,
            page: page,
            sort: "",
            total_page: totalPage,
            total_rows: Number(resultComment === null || resultComment === void 0 ? void 0 : resultComment.total_rows),
            rows: resultComment === null || resultComment === void 0 ? void 0 : resultComment.rows,
        };
        res
            .status(200)
            .json((0, sendResponse_1.sendResponsePaginate)(req, responseData, "Successfully Get Comment", 200));
    }
    catch (error) {
        let message = "Internal Server Error";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(500).json((0, sendResponse_1.errorResponse)(req, message, 500, "error"));
    }
});
exports.GetCommentRecipeController = GetCommentRecipeController;
