"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const likeRecipe_1 = require("../../controllers/likeRecipe/likeRecipe");
const validate_token_1 = require("../../middlewares/validate-token");
const LikeRoutes = express_1.default.Router();
LikeRoutes.post("/add-like", validate_token_1.validateToken, likeRecipe_1.CreateLikeRecipeController);
LikeRoutes.get("/get-like-recipe", validate_token_1.validateToken, likeRecipe_1.GetLikeRecipeByUserController);
exports.default = LikeRoutes;
