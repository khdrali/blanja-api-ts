import express from "express";
import {
  addCategoryController,
  getCategoryController,
} from "../controllers/category";

const categoryRoutes = express.Router();

categoryRoutes.post("/add-category", addCategoryController);
categoryRoutes.get("/", getCategoryController);

export default categoryRoutes;
