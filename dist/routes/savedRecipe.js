"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_token_1 = require("../middlewares/validate-token");
const savedRecipe_1 = require("../controllers/savedRecipe");
const SavedRoutes = express_1.default.Router();
SavedRoutes.post("/save-recipe", validate_token_1.validateToken, savedRecipe_1.savedRecipeController);
SavedRoutes.get("/get-save-recipe", validate_token_1.validateToken, savedRecipe_1.GetSavedRecipeByUserController);
exports.default = SavedRoutes;
