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
exports.DeleteRecipeController = exports.UpdateRecipeController = exports.GetRecipeByUserIdController = exports.GetRecipeByIdController = exports.GetAllRecipeController = exports.CreateRecipeController = void 0;
const recipe_1 = require("../../models/recipe/recipe");
const dotenv_1 = __importDefault(require("dotenv"));
const sendResponse_1 = require("../../utils/sendResponse");
const video_1 = require("../../models/video/video");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const likeRecipe_1 = require("../../models/likeRecipe/likeRecipe");
const savedRecipe_1 = require("../../models/savedRecipe/savedRecipe");
dotenv_1.default.config();
const CreateRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { title, ingredients, category_id } = req.body;
    const files = req.files;
    try {
        const user_id = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0; // Ambil user_id dari token
        if (!user_id || user_id == 0) {
            res.status(401).json((0, sendResponse_1.errorResponse)(req, "Unauthorized", 401, "error"));
        }
        const image_recipe = files.image_recipe
            ? `/uploads/images/${files.image_recipe[0].filename}`
            : null;
        // Membuat recipe
        const recipeParams = {
            user_id: user_id,
            title: title,
            ingredients: ingredients,
            image_recipe: image_recipe,
            created_at: new Date(),
            category_id: category_id,
        };
        const recipe = yield (0, recipe_1.CreateRecipeModels)(recipeParams);
        if (files.videos) {
            const videoUlrs = files.videos.map((video) => `/uploads/videos/${video === null || video === void 0 ? void 0 : video.filename}`);
            for (const videoUlr of videoUlrs) {
                yield (0, video_1.CreateVideoModels)({
                    recipe_id: recipe.id,
                    video_url: videoUlr, // Pass array of video URLs
                });
            }
            recipe.videos = videoUlrs;
        }
        res
            .status(200)
            .json((0, sendResponse_1.sendResponses)(req, recipe, "Successfully Created Recipe", 200));
    }
    catch (error) {
        res.status(500).json((0, sendResponse_1.errorResponse)(req, String(error), 500, "error"));
    }
});
exports.CreateRecipeController = CreateRecipeController;
const GetAllRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const limit = 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        const search = req.query.search || "";
        const category = req.query.category || undefined;
        const result = yield (0, recipe_1.GetAllRecipeModels)({
            sort: "",
            limit: String(limit),
            offset: String(offset),
            search: search,
            categoryId: Number(category),
        }, userId);
        const totalPage = Math.ceil((result === null || result === void 0 ? void 0 : result.total_rows) / limit);
        const responseData = {
            limit: limit,
            page: page,
            sort: "",
            total_page: totalPage,
            total_rows: Number(result === null || result === void 0 ? void 0 : result.total_rows),
            rows: result === null || result === void 0 ? void 0 : result.rows,
        };
        res
            .status(200)
            .json((0, sendResponse_1.sendResponsePaginate)(req, responseData, "Successfully Get All Data", 200));
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal Server Error", 500, "error"));
    }
});
exports.GetAllRecipeController = GetAllRecipeController;
const GetRecipeByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        const GetDetailRecipe = {
            recipeId: Number(id),
            userId: userId || null,
        };
        if (typeof id !== "string") {
            res
                .status(400)
                .json((0, sendResponse_1.errorResponse)(req, "ID parameter must be a string", 400, "error"));
        }
        const result = yield (0, recipe_1.GetRecipeByIdModels)(GetDetailRecipe);
        if (result && result.length > 0) {
            res
                .status(200)
                .json((0, sendResponse_1.sendResponses)(req, result, "Successfully Get Recipe", 200));
        }
        else {
            res
                .status(404)
                .json((0, sendResponse_1.errorResponse)(req, "Recipe Not Found", 404, "error"));
        }
    }
    catch (error) {
        console.error("Error GetAllRecipeController:", error);
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal Server Error", 500, "error"));
    }
});
exports.GetRecipeByIdController = GetRecipeByIdController;
const GetRecipeByUserIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        const result = yield (0, recipe_1.GetRecipeByUserIdModels)(id);
        if (result && result.length > 0) {
            res
                .status(200)
                .json((0, sendResponse_1.sendResponses)(req, result, "Successfully Get Recipe", 200));
        }
        else {
            res
                .status(404)
                .json((0, sendResponse_1.errorResponse)(req, "Recipe Not Found", 404, "error"));
        }
    }
    catch (error) {
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal Server Errro", 500, "error"));
    }
});
exports.GetRecipeByUserIdController = GetRecipeByUserIdController;
const UpdateRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const { title, ingredients, category_id, delete_video_ids } = req.body;
        const files = req.files;
        const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
        const GetDetailRecipe = {
            recipeId: Number(id),
            userId: userId || null,
        };
        const getRecipeId = yield (0, recipe_1.GetRecipeByIdModels)(GetDetailRecipe);
        if (getRecipeId.length === 0) {
            res
                .status(404)
                .json((0, sendResponse_1.errorResponse)(req, "Recipe Not Found", 404, "error"));
            return;
        }
        if (getRecipeId[0].user_id !== userId) {
            res
                .status(403)
                .json((0, sendResponse_1.errorResponse)(req, "Unauthorized to update this recipe", 403, "error"));
            return;
        }
        const image_recipe = ((_b = files.image_recipe) === null || _b === void 0 ? void 0 : _b[0])
            ? `/uploads/images/${files.image_recipe[0].filename}`
            : null;
        const parsedDeleteVideoIds = Array.isArray(delete_video_ids)
            ? delete_video_ids.map(Number)
            : delete_video_ids
                ? [Number(delete_video_ids)]
                : [];
        const dataUploadRecipe = {
            id: Number(id),
            title: title ? title : getRecipeId[0].title,
            ingredients: ingredients ? ingredients : getRecipeId[0].ingredients,
            image_recipe: image_recipe ? image_recipe : getRecipeId[0].image_recipe,
            category_id: category_id ? category_id : getRecipeId[0].category_id,
        };
        const resultRecipe = yield (0, recipe_1.UpdateRecipeModels)(dataUploadRecipe);
        if (parsedDeleteVideoIds.length > 0) {
            const deleteResult = yield (0, video_1.DeleteVideoModels)(parsedDeleteVideoIds);
        }
        const newVideoFiles = files.videos || [];
        if (resultRecipe[0].videos.length + (newVideoFiles.length || 0) > 3) {
            res
                .status(400)
                .json((0, sendResponse_1.errorResponse)(req, "Maximum video only 3", 400, "error"));
        }
        else {
            if (newVideoFiles.length > 0) {
                const videoUrls = newVideoFiles.map((file) => `/uploads/videos/${file.filename}`);
                yield (0, video_1.CreateVideoModels)({
                    recipe_id: Number(id),
                    video_url: videoUrls,
                });
            }
        }
        // Get latest videos
        const updatedVideos = yield (0, video_1.GetVideosByRecipeId)(Number(id));
        res.status(200).json((0, sendResponse_1.sendResponses)(req, Object.assign(Object.assign({}, resultRecipe[0]), { videos: updatedVideos }), "Recipe and videos updated successfully", 200));
    }
    catch (error) {
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal Server Error", 500, "error"));
    }
});
exports.UpdateRecipeController = UpdateRecipeController;
const DeleteRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        const userId = ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id) || 0;
        const recipeData = yield (0, recipe_1.GetRecipeByIdModels)({
            recipeId: Number(id),
            userId: userId,
        });
        if (recipeData.length === 0) {
            res
                .status(404)
                .json((0, sendResponse_1.errorResponse)(req, "Recipe Not Found", 404, "error"));
            return;
        }
        if (recipeData[0].user_id !== userId) {
            res.status(403).json((0, sendResponse_1.errorResponse)(req, "Unauthorized", 403, "error"));
            return;
        }
        recipeData.forEach((row) => {
            if (row.image_recipe) {
                const imagePath = path_1.default.join(__dirname, "../../uploads", row.image_recipe);
                if (fs_1.default.existsSync(imagePath)) {
                    fs_1.default.unlinkSync(imagePath);
                }
            }
            if (row.video_url) {
                const videoPath = path_1.default.join(__dirname, "../../uploads", row === null || row === void 0 ? void 0 : row.video_url);
                if (fs_1.default.existsSync(videoPath)) {
                    fs_1.default === null || fs_1.default === void 0 ? void 0 : fs_1.default.unlinkSync(videoPath);
                }
            }
        });
        yield (0, video_1.DeleteVideoByRecipeIdModels)(id);
        yield (0, likeRecipe_1.DeleteLikeRecipeByRecipeModels)(id);
        yield (0, savedRecipe_1.DeleteSavedRecipeByRecipeModels)(id);
        yield (0, recipe_1.DeleteRecipeModels)(id);
        res
            .status(200)
            .json((0, sendResponse_1.sendResponses)(req, null, "Recipe deleted successfully", 200));
    }
    catch (error) {
        res
            .status(500)
            .json((0, sendResponse_1.errorResponse)(req, "Internal Server Error", 500, "error"));
    }
});
exports.DeleteRecipeController = DeleteRecipeController;
