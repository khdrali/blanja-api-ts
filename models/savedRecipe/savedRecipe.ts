import db from "../../db";
import { LimitType } from "../type";
import { CreateSavedType } from "./type";

export const CreateSavedRecipeModels = async (params: CreateSavedType) => {
  const existing =
    await db`SELECT is_saved FROM public.saved_recipe WHERE user_id=${params?.user_id} AND recipe_id=${params?.recipe_id}`;

  if (existing.length > 0) {
    const currentSaved = existing[0].is_saved;

    const newSaved = !currentSaved;
    await db`UPDATE public.saved_recipe SET is_saved=${newSaved} WHERE user_id=${params?.user_id} AND recipe_id=${params?.recipe_id}`;

    return {
      is_saved: newSaved,
    };
  } else {
    await db`INSERT INTO public.saved_recipe(is_saved,recipe_id,user_id) VALUES(true,${params?.recipe_id},${params?.user_id})`;

    return {
      is_saved: true,
    };
  }
};

export const GetSavedRecipeByUserModels = async (
  params: LimitType,
  user_id: number,
  search?: string
) => {
  const recipes = await db`
  SELECT 
    r.id AS recipe_id,
    r.title,
    r.ingredients,
    r.image_recipe,
    r.category_id,
    r.user_id,
    r.created_at,
    COALESCE(like_count.count, 0) AS like_count
  FROM 
    public.saved_recipe sr
  JOIN 
    public.recipe r ON sr.recipe_id = r.id
  LEFT JOIN (
    SELECT recipe_id, COUNT(*) AS count
    FROM public.saved_recipe
    WHERE is_saved = true
    GROUP BY recipe_id
  ) like_count ON r.id = like_count.recipe_id
  WHERE 
    sr.user_id = ${user_id}
    AND sr.is_saved = true
    AND r.title ILIKE ${`%${search ?? ""}%`}
  GROUP BY 
    r.id,
    r.title,
    r.ingredients,
    r.image_recipe,
    r.category_id,
    r.user_id,
    r.created_at,
    like_count.count
  ORDER BY r.created_at DESC
  LIMIT ${params?.limit}
  OFFSET ${params?.offset};
`;

  const total = await db`
  SELECT COUNT(*) FROM public.saved_recipe sr
  JOIN public.recipe r ON sr.recipe_id = r.id
  WHERE sr.user_id = ${user_id} 
    AND sr.is_saved = true 
    AND r.title ILIKE ${"%" + search + "%"}
`;

  return {
    total_rows: Number(total[0]?.count || 0),
    rows: recipes,
  };
};

export const DeleteSavedRecipeByRecipeModels = async (id: string) => {
  await db`DELETE FROM public.saved_recipe WHERE recipe_id=${id}`;
};
