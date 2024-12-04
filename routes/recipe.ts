import express from "express";
import { validateToken } from "../middlewares/validate-token";
import {
  CreateRecipeController,
  GetAllRecipeController,
  GetRecipeByIdController,
  GetRecipeByUserIdController,
} from "../controllers/recipe";
import upload from "../middlewares/multerConfig";

const router = express.Router();

// Route dengan middleware validateToken
router.post(
  "/add-recipe",
  upload.fields([
    { name: "image_recipe", maxCount: 1 },
    { name: "videos", maxCount: 3 },
  ]),
  validateToken,
  CreateRecipeController
);

router.get("/get-recipe", GetAllRecipeController);
router.get("/detail-recipe/:id", GetRecipeByIdController);
router.get("/user-recipe/:id", validateToken, GetRecipeByUserIdController);
export default router;
