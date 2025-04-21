import express from "express";
import {
  CreateLikeRecipeController,
  GetLikeRecipeByUserController,
} from "../../controllers/likeRecipe/likeRecipe";
import { validateToken } from "../../middlewares/validate-token";

const LikeRoutes = express.Router();

LikeRoutes.post("/add-like", validateToken, CreateLikeRecipeController);
LikeRoutes.get(
  "/get-like-recipe",
  validateToken,
  GetLikeRecipeByUserController
);

export default LikeRoutes;
