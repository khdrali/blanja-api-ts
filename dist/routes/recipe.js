"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_token_1 = require("../middlewares/validate-token");
const recipe_1 = require("../controllers/recipe");
const router = express_1.default.Router();
// Route dengan middleware validateToken
router.post("/add-recipe", validate_token_1.validateToken, recipe_1.CreateRecipeController);
exports.default = router;
