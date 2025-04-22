import { Request, Response } from "express";
import {
  Data,
  errorResponse,
  sendResponsePaginate,
  sendResponses,
} from "../../utils/sendResponse";
import { CreateSavedType } from "../../models/savedRecipe/type";
import {
  CreateSavedRecipeModels,
  GetSavedRecipeByUserModels,
} from "../../models/savedRecipe/savedRecipe";

export const savedRecipeController = async (req: Request, res: Response) => {
  try {
    const { recipe_id } = req?.body;
    const user_Id = req?.user?.id ?? 0;

    if (!user_Id || user_Id === 0) {
      res.status(401).json(errorResponse(req, "Unauthorized", 401, "error"));
      return;
    }

    if (recipe_id === 0) {
      res
        ?.status(400)
        .json(errorResponse(req, "Failed To Saved Recipe", 400, "error"));
      return;
    }

    const SavedParams: CreateSavedType = {
      recipe_id: recipe_id,
      user_id: user_Id,
    };

    const CreateSaved = await CreateSavedRecipeModels(SavedParams);
    const message = CreateSaved.is_saved
      ? "You Saved the Recipe"
      : "You Unsaved the Recipe";
    res.status(200).json(sendResponses(req, null, message, 200));
  } catch (error) {
    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
    }

    res?.status(500).json(errorResponse(req, message, 500, "error"));
  }
};

export const GetSavedRecipeByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const limit = 10;
    const page = Number(req?.query.page) || 1;
    const offset = (page - 1) * limit;
    const search = (req?.query.search as string) || "";
    const userId = req?.user?.id;

    if (!userId) {
      res.status(403).json(errorResponse(req, "Unauthorized", 403, "error"));
      return;
    }

    const result = await GetSavedRecipeByUserModels(
      { limit: String(limit), offset: String(offset), sort: "" },
      userId,
      search
    );
    const total_page = Math.ceil(result.total_rows / limit);
    const responseData: Data = {
      limit,
      page,
      sort: "",
      total_page,
      total_rows: Number(result?.total_rows),
      rows: result?.rows,
    };
    res
      .status(200)
      .json(
        sendResponsePaginate(req, responseData, "Successfully Get Recipe", 200)
      );
  } catch (error) {
    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json(errorResponse(req, message, 500, "error"));
  }
};
