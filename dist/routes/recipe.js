"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_token_1 = require("../middlewares/validate-token");
const recipe_1 = require("../controllers/recipe");
const multerConfig_1 = __importDefault(require("../middlewares/multerConfig"));
const router = express_1.default.Router();
// Route dengan middleware validateToken
router.post("/add-recipe", multerConfig_1.default.fields([
    { name: "image_recipe", maxCount: 1 },
    { name: "videos", maxCount: 3 },
]), validate_token_1.validateToken, recipe_1.CreateRecipeController);
router.get("/get-recipe", recipe_1.GetAllRecipeController);
router.get('/detail-recipe/:id', recipe_1.GetRecipeByIdController);
exports.default = router;
