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
exports.GetRecipeByUserIdController = exports.GetRecipeByIdController = exports.GetAllRecipeController = exports.CreateRecipeController = void 0;
const recipe_1 = require("../models/recipe");
const dotenv_1 = __importDefault(require("dotenv"));
const sendResponse_1 = require("../utils/sendResponse");
dotenv_1.default.config();
const CreateRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { title, ingredients, category_id } = req.body;
    const files = req.files;
    try {
        const user_id = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0; // Ambil user_id dari token
        if (!user_id || user_id == 0) {
            (0, sendResponse_1.sendResponse)(res, 401, false, "Unauthorized");
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
                yield (0, recipe_1.CreateVideoModels)({
                    recipe_id: recipe.id,
                    video_url: videoUlr, // Pass array of video URLs
                });
            }
            recipe.videos = videoUlrs;
        }
        (0, sendResponse_1.sendResponse)(res, 200, true, "Successfully Created Recipe", recipe);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Error creating recipe videos");
    }
});
exports.CreateRecipeController = CreateRecipeController;
const GetAllRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, recipe_1.GetAllRecipeModels)();
        (0, sendResponse_1.sendResponse)(res, 200, true, "Successfully Get All Data", result);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Internal server error", []);
    }
});
exports.GetAllRecipeController = GetAllRecipeController;
const GetRecipeByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        if (typeof id !== "string") {
            (0, sendResponse_1.sendResponse)(res, 400, false, "ID parameter must be a string");
        }
        const result = yield (0, recipe_1.GetRecipeByIdModels)(id);
        if (result && result.length > 0) {
            (0, sendResponse_1.sendResponse)(res, 200, true, "Successfully Get Recipe", result);
        }
        else {
            (0, sendResponse_1.sendResponse)(res, 404, false, "Recipe Not Found", []);
        }
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Internal Server Error", []);
    }
});
exports.GetRecipeByIdController = GetRecipeByIdController;
const GetRecipeByUserIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        const result = yield (0, recipe_1.GetRecipeByUserIdModels)(id);
        if (result && result.length > 0) {
            (0, sendResponse_1.sendResponse)(res, 200, true, "Successfully Get Recipe", result);
        }
        else {
            (0, sendResponse_1.sendResponse)(res, 404, false, "Recipe Not Found", []);
        }
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Internal Server Error", []);
    }
});
exports.GetRecipeByUserIdController = GetRecipeByUserIdController;
