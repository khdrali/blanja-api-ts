import { Request, Response } from "express";
import {
  Data,
  errorResponse,
  sendResponsePaginate,
  sendResponses,
} from "../../utils/sendResponse";
import { CreateLikeType } from "../../models/likeRecipe/type";
import {
  CreateOrToggleLikeModels,
  GetLikeRecipeByUserModels,
} from "../../models/likeRecipe/likeRecipe";

export const CreateLikeRecipeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { recipe_id } = req?.body;
    const user_id = req?.user?.id ?? 0;

    if (!user_id || user_id == 0) {
      res.status(401).json(errorResponse(req, "Unauthorized", 401, "error"));
    }

    if (recipe_id == 0) {
      res
        .status(400)
        .json(errorResponse(req, "Failed to like recipe", 400, "error"));
    }

    const likeParams: CreateLikeType = {
      recipe_id: recipe_id,
      user_id: user_id,
    };
    const CreateLike = await CreateOrToggleLikeModels(likeParams);
    const message = CreateLike.is_like
      ? "You liked the recipe."
      : "You unliked the recipe.";
    res.status(200).json(sendResponses(req, null, message, 200));
  } catch (error) {
    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json(errorResponse(req, message, 500, "error"));
  }
};

export const GetLikeRecipeByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const limit = 10;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const search = (req.query.search as string) || "";
    const userId = req?.user?.id;

    if (!userId) {
      res.status(403).json(errorResponse(req, "Unauthorized", 403, "error"));
      return;
    }

    const result = await GetLikeRecipeByUserModels(
      { limit: String(limit), offset: String(offset), sort: "" },
      userId,
      search
    );
    const totalPage = Math.ceil(result?.total_rows / limit);
    const responseData: Data = {
      limit: limit,
      page: page,
      sort: "",
      total_page: totalPage,
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
