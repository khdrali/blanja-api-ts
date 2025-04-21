import express from "express";
import {
  addCategoryController,
  getCategoryController,
  UpdateCategoryController,
} from "../../controllers/category/category";

const categoryRoutes = express.Router();

categoryRoutes.post("/add-category", addCategoryController);
categoryRoutes.get("/", getCategoryController);
categoryRoutes.patch("/update-category/:id", UpdateCategoryController);

export default categoryRoutes;
