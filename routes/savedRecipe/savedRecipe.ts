import express from "express";
import { validateToken } from "../../middlewares/validate-token";
import {
  GetSavedRecipeByUserController,
  savedRecipeController,
} from "../../controllers/savedRecipe/savedRecipe";

const SavedRoutes = express.Router();

SavedRoutes.post("/save-recipe", validateToken, savedRecipeController);
SavedRoutes.get(
  "/get-save-recipe",
  validateToken,
  GetSavedRecipeByUserController
);

export default SavedRoutes;
