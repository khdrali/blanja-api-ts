import db from "../../db";
import { LimitType } from "../type";
import { CreateLikeType } from "./type";

export const CreateOrToggleLikeModels = async (params: CreateLikeType) => {
  const existing = await db`
    SELECT is_like FROM public.like_recipe
    WHERE user_id = ${params.user_id} AND recipe_id = ${params.recipe_id}
  `;

  if (existing.length > 0) {
    const currentLike = existing[0].is_like;

    const newLike = !currentLike; // toggle
    await db`
      UPDATE public.like_recipe
      SET is_like = ${newLike}
      WHERE user_id = ${params.user_id} AND recipe_id = ${params.recipe_id}
    `;

    return {
      is_like: newLike,
    };
  } else {
    // insert baru
    await db`
      INSERT INTO public.like_recipe (is_like, recipe_id, user_id)
      VALUES (true, ${params.recipe_id}, ${params.user_id})
    `;
    return {
      is_like: true,
    };
  }
};

export const GetLikeRecipeByUserModels = async (
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
    public.like_recipe lr
  JOIN 
    public.recipe r ON lr.recipe_id = r.id
  LEFT JOIN (
    SELECT recipe_id, COUNT(*) AS count
    FROM public.like_recipe
    WHERE is_like = true
    GROUP BY recipe_id
  ) like_count ON r.id = like_count.recipe_id
  WHERE 
    lr.user_id = ${user_id}
    AND lr.is_like = true
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
  SELECT COUNT(*) FROM public.like_recipe lr
  JOIN public.recipe r ON lr.recipe_id = r.id
  WHERE lr.user_id = ${user_id} 
    AND lr.is_like = true 
    AND r.title ILIKE ${"%" + search + "%"}
`;

  return {
    total_rows: Number(total[0]?.count || 0),
    rows: recipes,
  };
};

export const DeleteLikeRecipeByRecipeModels = async (id: string) => {
  await db`DELETE FROM public.like_recipe WHERE recipe_id=${id}`;
};
