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
exports.CreateRecipeController = void 0;
const recipe_1 = require("../models/recipe");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CreateRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { title, ingredients, image_recipe, videos } = req.body;
    try {
        const user_id = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0; // Ambil user_id dari token
        if (!user_id || user_id == 0) {
            res.status(401).json({
                valid: false,
                status: 401,
                message: "Unauthorized",
            });
        }
        // Membuat recipe
        const recipeParams = {
            user_id: user_id,
            title: title,
            ingredients: ingredients,
            image_recipe: image_recipe,
            created_at: new Date(),
        };
        const recipe = yield (0, recipe_1.CreateRecipeModels)(recipeParams);
        // Jika videos adalah array, maka masukkan semua video
        if (videos && Array.isArray(videos)) {
            yield (0, recipe_1.CreateVideoModels)({
                recipe_id: recipe.id,
                video_url: videos, // Pass array of video URLs
            });
        }
        else if (videos) {
            // Jika hanya satu video, langsung masukkan satu video
            yield (0, recipe_1.CreateVideoModels)({
                recipe_id: recipe.id,
                video_url: videos, // Pass single video URL
            });
        }
        res.status(200).json({
            valid: true,
            status: 200,
            message: "Successfully Created Recipe",
            data: {
                recipe: recipe,
                videos: videos || [],
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            valid: false,
            status: 500,
            message: "Error creating recipe and videos",
        });
    }
});
exports.CreateRecipeController = CreateRecipeController;
