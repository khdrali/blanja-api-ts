import { Request, Response } from "express";
import {
  CreateRecipeModels,
  CreateVideoModels,
  GetAllRecipeModels,
  GetRecipeByIdModels,
  GetRecipeByUserIdModels,
} from "../models/recipe";
import dotenv from "dotenv";
import { CreateRecipeType } from "../models/type";
import { GetUserByIdModels } from "../models/user";
import { sendResponse } from "../utils/sendResponse";

dotenv.config();

export const CreateRecipeController = async (req: Request, res: Response) => {
  const { title, ingredients } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  try {
    const user_id = req.user?.id ?? 0; // Ambil user_id dari token

    if (!user_id || user_id == 0) {
      sendResponse(res, 401, false, "Unauthorized");
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
    }
    sendResponse(res, 200, true, "Successfully Created Recipe", {
      recipe: recipe,
      videos: files?.videos
        ? files.videos.map((video) => `/uploads/videos/${video.filename}`)
        : [],
    });
  } catch (error) {
    sendResponse(res, 500, false, "Error creating recipe videos");
  }
};

export const GetAllRecipeController = async (req: Request, res: Response) => {
  try {
    const result = await GetAllRecipeModels();
    sendResponse(res, 200, true, "Successfully Get All Data", result);
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error", []);
  }
};

export const GetRecipeByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req?.params;
    if (typeof id !== "string") {
      sendResponse(res, 400, false, "ID parameter must be a string");
    }

    const result = await GetRecipeByIdModels(id);
    if (result && result.length > 0) {
      sendResponse(res, 200, true, "Successfully Get Recipe", result);
    } else {
      sendResponse(res, 404, false, "Recipe Not Found", []);
    }
  } catch (error) {
    sendResponse(res, 500, false, "Internal Server Error", []);
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
      sendResponse(res, 200, true, "Successfully Get Recipe", result);
    } else {
      sendResponse(res, 404, false, "Recipe Not Found", []);
    }
  } catch (error) {
    sendResponse(res, 500, false, "Internal Server Error", []);
  }
};
