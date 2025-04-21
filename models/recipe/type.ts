export interface CreateRecipeType {
  title: string;
  ingredients: string;
  image_recipe: string | null;
  user_id: number;
  created_at: Date;
  category_id: number;
}

export interface getDetailRecipeType {
  userId: number | null;
  recipeId: number;
}

export interface UpdateRecipeType {
  id?: number;
  title: string;
  ingredients: string;
  image_recipe: string | null;
  category_id: number;
}

export interface GetDataType {
  recipe_id: number;
  title: string;
  ingredients: string;
  image_recipe: string;
  user_id: string;
  created_at: Date;
  video_url: string | string[];
}
