import { Request, Response } from "express";
import { addCategoryModels, getCategoryModels } from "../models/category";
import { sendResponse } from "../utils/sendResponse";

export const addCategoryController = async (req: Request, res: Response) => {
  try {
    const { category } = req?.body;
    if (!category) {
      sendResponse(res, 400, false, "Category not be empty");
      return;
    }
    const upperCase = category.toUpperCase();
    await addCategoryModels(upperCase);
    sendResponse(res, 200, true, "Successfully add category");
  } catch (error) {
    sendResponse(res, 500, false);
  }
};

export const getCategoryController = async (req: Request, res: Response) => {
  try {
    const result = await getCategoryModels();
    sendResponse(res, 200, true, "Successfuly Get Category", result);
  } catch (error) {
    sendResponse(res, 500, false);
  }
};
