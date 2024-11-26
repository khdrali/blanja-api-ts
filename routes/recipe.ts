import express from "express";
import { validateToken } from "../middlewares/validate-token";
import { CreateRecipeController } from "../controllers/recipe";

const router = express.Router();

// Route dengan middleware validateToken
router.post("/add-recipe", validateToken, CreateRecipeController);

export default router;
