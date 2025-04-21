import { Request, Response } from "express";
import { GetRecipeByIdModels } from "../../models/recipe/recipe";
import {
  Data,
  errorResponse,
  sendResponsePaginate,
  sendResponses,
} from "../../utils/sendResponse";
import {
  CreateCommentRecipeModels,
  DeleteCommentRecipeModels,
  GetCommentsByRecipeIdModels,
} from "../../models/comment/comment";
import { CommentType } from "../../models/comment/type";

export const CreateCommentRecipeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { comment, recipe_id } = req?.body;
    const userId = req?.user?.id ?? 0;

    if (!userId || userId === 0) {
      res.status(403).json(errorResponse(req, "Unauthorized", 403, "error"));
      return;
    }

    const resultRecipe = await GetRecipeByIdModels({
      recipeId: recipe_id,
      userId,
    });
    if (resultRecipe.length === 0) {
      res
        .status(404)
        .json(errorResponse(req, "Recipe Not Found", 403, "error"));
      return;
    }

    const dataComment: CommentType = {
      comment,
      recipe_id,
      user_id: String(userId),
      created_at: new Date(),
    };

    if (!comment || comment == "") {
      res
        .status(400)
        .json(errorResponse(req, "Comment not be empty", 400, "error"));
      return;
    }

    await CreateCommentRecipeModels(dataComment);

    res
      .status(200)
      .json(sendResponses(req, null, "Successfully Added Comments", 200));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(req, "Internal Server Error", 500, "error"));
  }
};

export const DeleteCommentRecipeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req?.params;
    const userId = req.user?.id ?? 0;

    if (!userId) {
      res.status(403).json(errorResponse(req, "Unauthorized", 403, "error"));
      return;
    }

    const deleted = await DeleteCommentRecipeModels({
      id: id,
      user_id: String(userId),
    });

    if (deleted.length === 0) {
      res
        .status(404)
        .json(
          errorResponse(
            req,
            "Comment not found or not authorized",
            404,
            "error"
          )
        );
      return;
    }

    res
      .status(200)
      .json(sendResponses(req, null, "Successfully Deleted Commnet", 200));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(req, "Internal server error", 500, "error"));
  }
};

export const GetCommentRecipeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req?.params;
    const limit = 10;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const userId = req?.user?.id;

    if (!userId) {
      res.status(403).json(errorResponse(req, "Unauthorized", 403, "error"));
      return;
    }

    const resultComment = await GetCommentsByRecipeIdModels(id, limit, offset);

    const totalPage = Math.ceil(resultComment?.total_rows / limit);
    const responseData: Data = {
      limit: limit,
      page: page,
      sort: "",
      total_page: totalPage,
      total_rows: Number(resultComment?.total_rows),
      rows: resultComment?.rows,
    };

    res
      .status(200)
      .json(
        sendResponsePaginate(req, responseData, "Successfully Get Comment", 200)
      );
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json(errorResponse(req, "Internal server error", 500, "error"));
  }
};
