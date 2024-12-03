import { Request, Response } from "express";
import {
  CreateRecipeModels,
  CreateVideoModels,
  GetAllRecipeModels,
  GetRecipeByIdModels,
} from "../models/recipe";
import dotenv from "dotenv";
import { CreateRecipeType } from "../models/type";
import { GetUserByIdModels } from "../models/user";

dotenv.config();

export const CreateRecipeController = async (req: Request, res: Response) => {
  const { title, ingredients } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  try {
    const user_id = req.user?.id ?? 0; // Ambil user_id dari token

    if (!user_id || user_id == 0) {
      res.status(401).json({
        valid: false,
        status: 401,
        message: "Unauthorized",
      });
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
    // if (videos && Array.isArray(videos)) {
    //   // Jika videos adalah array, maka masukkan semua video
    //   await CreateVideoModels({
    //     recipe_id: recipe.id,
    //     video_url: videos, // Pass array of video URLs
    //   });
    // } else if (videos) {
    //   // Jika hanya satu video, langsung masukkan satu video
    //   await CreateVideoModels({
    //     recipe_id: recipe.id,
    //     video_url: videos, // Pass single video URL
    //   });
    // }

    res.status(200).json({
      valid: true,
      status: 200,
      message: "Successfully Created Recipe",
      data: {
        recipe: recipe,
        videos: files.videos
          ? files.videos.map((video) => `/uploads/videos/${video.filename}`)
          : [],
      },
    });
  } catch (error) {
    res.status(500).json({
      valid: false,
      status: 500,
      message: "Error creating recipe and videos",
    });
  }
};

export const GetAllRecipeController = async (req: Request, res: Response) => {
  try {
    const result = await GetAllRecipeModels();
    res.json({
      valid: true,
      status: 200,
      message: "Successfuly Get All Data",
      data:result
    });
  } catch (error) {
    
    res.json({
      valid:false,
      status:500,
      message:error,
      data:[]
    })
  }
};

export const GetRecipeByIdController=async(req:Request,res:Response)=>{
  try {
    const { id } = req?.params;
    if (typeof id !== 'string') {
       res.status(400).json({
        valid: false,
        status: 400,
        message: 'ID parameter must be a string',
      });
    }

    const result = await GetRecipeByIdModels(id);
    if (result && result.length > 0) {
       res.status(200).json({
        valid: true,
        status: 200,
        message: 'Successfully Get Recipe',
        data: result,
      });
    } else {
       res.status(404).json({
        valid: false,
        status: 404,
        message: 'Recipe Not Found',
        data: [],
      });
    }
  } catch (error) {
   res.status(500).json({
    valid:false,
    status:500,
    message:error,
    data:[]
   })
  }
}