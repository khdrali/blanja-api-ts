import { Request, Response } from "express";
import {
  CreateRecipeModels,
  DeleteRecipeModels,
  GetAllRecipeModels,
  GetRecipeByIdModels,
  GetRecipeByUserIdModels,
  UpdateRecipeModels,
} from "../../models/recipe/recipe";
import dotenv from "dotenv";
import {
  Data,
  errorResponse,
  sendResponsePaginate,
  sendResponses,
} from "../../utils/sendResponse";
import {
  CreateRecipeType,
  getDetailRecipeType,
  UpdateRecipeType,
} from "../../models/recipe/type";
import {
  CreateVideoModels,
  DeleteVideoByRecipeIdModels,
  DeleteVideoModels,
  GetVideosByRecipeId,
} from "../../models/video/video";
import path from "path";
import fs from "fs";
import { DeleteLikeRecipeByRecipeModels } from "../../models/likeRecipe/likeRecipe";
import { DeleteSavedRecipeByRecipeModels } from "../../models/savedRecipe/savedRecipe";

dotenv.config();

export const CreateRecipeController = async (req: Request, res: Response) => {
  const { title, ingredients, category_id } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  try {
    const user_id = req.user?.id ?? 0; // Ambil user_id dari token

    if (!user_id || user_id == 0) {
      res.status(401).json(errorResponse(req, "Unauthorized", 401, "error"));
    }

    const image_recipe = files.image_recipe
      ? `/uploads/images/${files.image_recipe[0].filename}`
      : null;

    // Membuat recipe
    const recipeParams: CreateRecipeType = {
      user_id: user_id,
      title: title,
      ingredients: ingredients,
      image_recipe: image_recipe,
      created_at: new Date(),
      category_id: category_id as number,
    };

    const recipe = await CreateRecipeModels(recipeParams);

    if (files.videos) {
      const videoUlrs = files.videos.map(
        (video) => `/uploads/videos/${video?.filename}`
      );
      for (const videoUlr of videoUlrs) {
        await CreateVideoModels({
          recipe_id: recipe.id,
          video_url: videoUlr, // Pass array of video URLs
        });
      }
      recipe.videos = videoUlrs;
    }
    res
      .status(200)
      .json(sendResponses(req, recipe, "Successfully Created Recipe", 200));
  } catch (error) {
    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json(errorResponse(req, message, 500, "error"));
  }
};

export const GetAllRecipeController = async (req: Request, res: Response) => {
  try {
    const limit = 10;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const userId = req?.user?.id;
    const search = req.query.search || "";
    const category = req.query.category || undefined;

    const result = await GetAllRecipeModels(
      {
        sort: "",
        limit: String(limit),
        offset: String(offset),
        search: search as string,
        categoryId: Number(category),
      },
      userId
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
        sendResponsePaginate(
          req,
          responseData,
          "Successfully Get All Data",
          200
        )
      );
  } catch (error) {
    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
    }

    res.status(500).json(errorResponse(req, message, 500, "error"));
  }
};

export const GetRecipeByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req?.params;
    const userId = req?.user?.id;
    const GetDetailRecipe: getDetailRecipeType = {
      recipeId: Number(id),
      userId: userId || null,
    };

    if (typeof id !== "string") {
      res
        .status(400)
        .json(
          errorResponse(req, "ID parameter must be a string", 400, "error")
        );
    }

    const result = await GetRecipeByIdModels(GetDetailRecipe);
    if (result && result.length > 0) {
      res
        .status(200)
        .json(sendResponses(req, result, "Successfully Get Recipe", 200));
    } else {
      res
        .status(404)
        .json(errorResponse(req, "Recipe Not Found", 404, "error"));
    }
  } catch (error) {
    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json(errorResponse(req, message, 500, "error"));
  }
};

export const GetRecipeByUserIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req?.params;

    const result = await GetRecipeByUserIdModels(id);
    if (result && result.length > 0) {
      res
        .status(200)
        .json(sendResponses(req, result, "Successfully Get Recipe", 200));
    } else {
      res
        .status(404)
        .json(errorResponse(req, "Recipe Not Found", 404, "error"));
    }
  } catch (error) {
    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json(errorResponse(req, message, 500, "error"));
  }
};

export const UpdateRecipeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, ingredients, category_id, delete_video_ids } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const userId = req?.user?.id;

    const GetDetailRecipe: getDetailRecipeType = {
      recipeId: Number(id),
      userId: userId || null,
    };

    const getRecipeId = await GetRecipeByIdModels(GetDetailRecipe);
    if (getRecipeId.length === 0) {
      res
        .status(404)
        .json(errorResponse(req, "Recipe Not Found", 404, "error"));
      return;
    }

    if (getRecipeId[0].user_id !== userId) {
      res
        .status(403)
        .json(
          errorResponse(req, "Unauthorized to update this recipe", 403, "error")
        );
      return;
    }

    const image_recipe = files.image_recipe?.[0]
      ? `/uploads/images/${files.image_recipe[0].filename}`
      : null;

    const parsedDeleteVideoIds: number[] = Array.isArray(delete_video_ids)
      ? delete_video_ids.map(Number)
      : delete_video_ids
      ? [Number(delete_video_ids)]
      : [];

    const dataUploadRecipe = {
      id: Number(id),
      title: title ? title : getRecipeId[0].title,
      ingredients: ingredients ? ingredients : getRecipeId[0].ingredients,
      image_recipe: image_recipe ? image_recipe : getRecipeId[0].image_recipe,
      category_id: category_id ? category_id : getRecipeId[0].category_id,
    };

    const resultRecipe = await UpdateRecipeModels(dataUploadRecipe);

    if (parsedDeleteVideoIds.length > 0) {
      const deleteResult = await DeleteVideoModels(parsedDeleteVideoIds);
    }

    const newVideoFiles = files.videos || [];
    if (resultRecipe[0].videos.length + (newVideoFiles.length || 0) > 3) {
      res
        .status(400)
        .json(errorResponse(req, "Maximum video only 3", 400, "error"));
    } else {
      if (newVideoFiles.length > 0) {
        const videoUrls = newVideoFiles.map(
          (file: any) => `/uploads/videos/${file.filename}`
        );
        await CreateVideoModels({
          recipe_id: Number(id),
          video_url: videoUrls,
        });
      }
    }

    // Get latest videos
    const updatedVideos = await GetVideosByRecipeId(Number(id));

    res.status(200).json(
      sendResponses(
        req,
        {
          ...resultRecipe[0],
          videos: updatedVideos,
        },
        "Recipe and videos updated successfully",
        200
      )
    );
  } catch (error) {
    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json(errorResponse(req, message, 500, "error"));
  }
};

export const DeleteRecipeController = async (req: Request, res: Response) => {
  try {
    const { id } = req?.params;
    const userId = req?.user?.id || 0;

    const recipeData = await GetRecipeByIdModels({
      recipeId: Number(id),
      userId: userId,
    });

    if (recipeData.length === 0) {
      res
        .status(404)
        .json(errorResponse(req, "Recipe Not Found", 404, "error"));
      return;
    }

    if (recipeData[0].user_id !== userId) {
      res.status(403).json(errorResponse(req, "Unauthorized", 403, "error"));
      return;
    }

    recipeData.forEach((row) => {
      if (row.image_recipe) {
        const imagePath = path.join(
          __dirname,
          "../../uploads",
          row.image_recipe
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      if (row.video_url) {
        const videoPath = path.join(__dirname, "../../uploads", row?.video_url);
        if (fs.existsSync(videoPath)) {
          fs?.unlinkSync(videoPath);
        }
      }
    });
    await DeleteVideoByRecipeIdModels(id);

    await DeleteLikeRecipeByRecipeModels(id);

    await DeleteSavedRecipeByRecipeModels(id);

    await DeleteRecipeModels(id);

    res
      .status(200)
      .json(sendResponses(req, null, "Recipe deleted successfully", 200));
  } catch (error) {
    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
    }
    res.status(500).json(errorResponse(req, message, 500, "error"));
  }
};
