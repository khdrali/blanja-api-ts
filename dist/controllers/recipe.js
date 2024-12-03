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
exports.GetRecipeByIdController = exports.GetAllRecipeController = exports.CreateRecipeController = void 0;
const recipe_1 = require("../models/recipe");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CreateRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { title, ingredients } = req.body;
    const files = req.files;
    try {
        const user_id = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : 0; // Ambil user_id dari token
        if (!user_id || user_id == 0) {
            res.status(401).json({
                valid: false,
                status: 401,
                message: "Unauthorized",
            });
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
        }
        // if (videos && Array.isArray(videos)) {
        //   // Jika videos adalah array, maka masukkan semua video
        //   await CreateVideoModels({
        //     recipe_id: recipe.id,
        //     video_url: videos, // Pass array of video URLs
        //   });
        // } else if (videos) {
        //   // Jika hanya satu video, langsung masukkan satu video
        //   await CreateVideoModels({
        //     recipe_id: recipe.id,
        //     video_url: videos, // Pass single video URL
        //   });
        // }
        res.status(200).json({
            valid: true,
            status: 200,
            message: "Successfully Created Recipe",
            data: {
                recipe: recipe,
                videos: files.videos
                    ? files.videos.map((video) => `/uploads/videos/${video.filename}`)
                    : [],
            },
        });
    }
    catch (error) {
        res.status(500).json({
            valid: false,
            status: 500,
            message: "Error creating recipe and videos",
        });
    }
});
exports.CreateRecipeController = CreateRecipeController;
const GetAllRecipeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, recipe_1.GetAllRecipeModels)();
        res.json({
            valid: true,
            status: 200,
            message: "Successfuly Get All Data",
            data: result
        });
    }
    catch (error) {
        res.json({
            valid: false,
            status: 500,
            message: error,
            data: []
        });
    }
});
exports.GetAllRecipeController = GetAllRecipeController;
const GetRecipeByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        if (typeof id !== 'string') {
            res.status(400).json({
                valid: false,
                status: 400,
                message: 'ID parameter must be a string',
            });
        }
        const result = yield (0, recipe_1.GetRecipeByIdModels)(id);
        if (result && result.length > 0) {
            res.status(200).json({
                valid: true,
                status: 200,
                message: 'Successfully Get Recipe',
                data: result,
            });
        }
        else {
            res.status(404).json({
                valid: false,
                status: 404,
                message: 'Recipe Not Found',
                data: [],
            });
        }
    }
    catch (error) {
        res.status(500).json({
            valid: false,
            status: 500,
            message: error,
            data: []
        });
    }
});
exports.GetRecipeByIdController = GetRecipeByIdController;
