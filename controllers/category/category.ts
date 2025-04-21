import { Request, Response } from "express";
import {
  addCategoryModels,
  getCategoryModels,
  UpdateCategoryModels,
} from "../../models/category/category";
import { errorResponse, sendResponses } from "../../utils/sendResponse";
import { UpdateCategoryType } from "../../models/category/type";

export const addCategoryController = async (req: Request, res: Response) => {
  try {
    const { category } = req?.body;
    if (!category) {
      res
        .status(400)
        .json(errorResponse(req, "Category not be empty", 400, "error"));
      return;
    }
    const upperCase = category.toUpperCase();
    await addCategoryModels(upperCase);
    res
      .status(200)
      .json(sendResponses(req, null, "Successfully add category", 200));
  } catch (error) {
    res.status(500).json(errorResponse(req, String(error), 500, "error"));
  }
};

export const getCategoryController = async (req: Request, res: Response) => {
  try {
    const result = await getCategoryModels();
    res
      .status(200)
      .json(sendResponses(req, result, "Successfuly Get Category", 200));
  } catch (error) {
    res.status(500).json(errorResponse(req, String(error), 500, "error"));
  }
};

export const UpdateCategoryController = async (req: Request, res: Response) => {
  try {
    const { category } = req?.body;
    const { id } = req?.params;

    const updateCategory: UpdateCategoryType = {
      id: id,
      category: category,
    };

    if (!id) {
      res
        ?.status(400)
        .json(errorResponse(req, "params id is required", 500, "error"));
    }
    const result = await UpdateCategoryModels(updateCategory);
    if (result.length === 0) {
      res
        .status(404)
        .json(errorResponse(req, "Category not found", 404, "error"));
    }
    res
      ?.status(200)
      .json(sendResponses(req, null, "Successfuly Update Category", 200));
  } catch (error) {
    console.error(error);
    res
      ?.status(500)
      .json(errorResponse(req, "Internal Server Error", 500, "error"));
  }
};
