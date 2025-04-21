import express from "express";
import { validateToken } from "../../middlewares/validate-token";
import {
  CreateRecipeController,
  DeleteRecipeController,
  GetAllRecipeController,
  GetRecipeByIdController,
  GetRecipeByUserIdController,
  UpdateRecipeController,
} from "../../controllers/recipe/recipe";
import upload from "../../middlewares/multerConfig";

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
router.get("/detail-recipe/:id", validateToken, GetRecipeByIdController);
router.get("/user-recipe/:id", validateToken, GetRecipeByUserIdController);
router.patch(
  "/update-recipe/:id",
  upload.fields([
    {
      name: "image_recipe",
      maxCount: 1,
    },
    {
      name: "videos",
      maxCount: 3,
    },
  ]),
  validateToken,
  UpdateRecipeController
);
router.delete("/delete-recipe/:id", validateToken, DeleteRecipeController);
export default router;
