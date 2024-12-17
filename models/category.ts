import db from "../db";

export const addCategoryModels = async (category: string) => {
  return await db`INSERT INTO public.recipe_categories (categories_name) VALUES (${category})`;
};

export const getCategoryModels = async () => {
  return await db`SELECT * FROM public.recipe_categories`;
};
