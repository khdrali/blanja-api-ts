import db from "../../db";
import { UpdateCategoryType } from "./type";

export const addCategoryModels = async (category: string) => {
  return await db`INSERT INTO public.recipe_categories (categories_name) VALUES (${category})`;
};

export const getCategoryModels = async () => {
  return await db`SELECT * FROM public.recipe_categories`;
};

export const UpdateCategoryModels = async (params: UpdateCategoryType) => {
  return await db`UPDATE public.recipe_categories SET categories_name=${params?.category} WHERE id =${params?.id} RETURNING *`;
};
