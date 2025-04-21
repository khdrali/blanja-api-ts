import connect from "../../db";
import { LimitType } from "../type";
import {
  CreateRecipeType,
  getDetailRecipeType,
  UpdateRecipeType,
} from "./type";

export const CreateRecipeModels = async (params: CreateRecipeType) => {
  const result = await connect`
    INSERT INTO public.recipe (title, ingredients, image_recipe, user_id, created_at, category_id)
    VALUES (${params.title}, ${params.ingredients}, ${params.image_recipe}, ${params.user_id}, ${params.created_at},${params?.category_id})
    RETURNING *`;

  return result[0];
};

export const GetAllRecipeModels = async (
  data: LimitType & { search?: string; categoryId?: number },
  userId?: number
) => {
  const conditions: string[] = [];
  const values: any[] = [];

  if (data.search) {
    conditions.push(`r.title ILIKE $${values.length + 1}`);
    values.push(`%${data.search}%`);
  }

  if (data.categoryId) {
    conditions.push(`r.category_id = $${values.length + 1}`);
    values.push(data.categoryId);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `${data.sort || "r.created_at DESC"}`;

  const result = await connect.unsafe(
    `
    SELECT 
      r.id AS recipe_id,
      r.title,
      r.ingredients,
      r.image_recipe,
      r.category_id,
      r.user_id,
      r.created_at,
      COALESCE(json_agg(DISTINCT jsonb_build_object('video_id', v.id, 'video_url', v.video_url)) 
        FILTER (WHERE v.video_url IS NOT NULL), '[]') AS videos,
      COALESCE(l.like_count, 0) AS like_count,
      CASE 
        WHEN ul.user_id IS NOT NULL THEN true 
        ELSE false 
      END AS is_liked
    FROM 
      public.recipe r
    LEFT JOIN 
      public.video v ON r.id = v.recipe_id
    LEFT JOIN (
      SELECT recipe_id, COUNT(*) AS like_count
      FROM public.like_recipe
      WHERE is_like = TRUE
      GROUP BY recipe_id
    ) l ON r.id = l.recipe_id
    LEFT JOIN (
      SELECT recipe_id, user_id
      FROM public.like_recipe
      WHERE user_id = ${userId ?? null} AND is_like = TRUE
    ) ul ON r.id = ul.recipe_id
    ${whereClause}
    GROUP BY 
      r.id, r.title, r.ingredients, r.image_recipe, r.category_id, r.user_id, r.created_at, l.like_count, ul.user_id
    ORDER BY ${query}
    LIMIT ${data.limit} OFFSET ${data.offset};
  `,
    values
  );

  const countResult = await connect.unsafe(
    `
    SELECT COUNT(*) AS total_rows 
    FROM public.recipe r
    ${whereClause};
  `,
    values
  );

  return {
    total_rows: Number(countResult[0]?.total_rows || 0),
    rows: result,
  };
};

export const GetRecipeByIdModels = async (params: getDetailRecipeType) => {
  return await connect`
SELECT 
  r.id AS recipe_id,
  r.title,
  r.ingredients,
  r.image_recipe,
  r.category_id,
  r.user_id,
  r.created_at,
  COALESCE(json_agg(DISTINCT jsonb_build_object('video_id', v.id, 'video_url', v.video_url)) 
    FILTER (WHERE v.video_url IS NOT NULL), '[]') AS videos,
  COALESCE(l.like_count, 0) AS like_count,
  CASE 
    WHEN ul.user_id IS NOT NULL THEN true 
    ELSE false 
  END AS is_liked
FROM 
  public.recipe r
LEFT JOIN 
  public.video v ON r.id = v.recipe_id
LEFT JOIN (
  SELECT recipe_id, COUNT(*) AS like_count
  FROM public.like_recipe
  WHERE is_like = TRUE
  GROUP BY recipe_id
) l ON r.id = l.recipe_id
LEFT JOIN (
  SELECT recipe_id, user_id
  FROM public.like_recipe
  WHERE user_id = ${params?.userId} AND is_like = TRUE
) ul ON r.id = ul.recipe_id
WHERE 
  r.id = ${params?.recipeId}
GROUP BY 
  r.id, r.title, r.ingredients, r.image_recipe, r.user_id, r.category_id, r.created_at, l.like_count, ul.user_id;

  `;
};

export const GetRecipeByUserIdModels = async (id: string) => {
  return await connect`
    SELECT 
      r.id AS recipe_id,
      r.title,
      r.ingredients,
      r.image_recipe,
      r.category_id,
      r.user_id,
      r.created_at,
      COALESCE(json_agg(DISTINCT v.video_url) FILTER (WHERE v.video_url IS NOT NULL), '[]') AS videos,
      COALESCE(l.like_count, 0) AS like_count
    FROM 
      public.recipe r
    LEFT JOIN 
      public.video v ON r.id = v.recipe_id
    LEFT JOIN (
      SELECT recipe_id, COUNT(*) AS like_count
      FROM public.like_recipe
      WHERE is_like = TRUE
      GROUP BY recipe_id
    ) l ON r.id = l.recipe_id
    WHERE 
      r.user_id = ${id}
    GROUP BY 
      r.id, r.title, r.ingredients, r.image_recipe, r.category_id, r.user_id, r.created_at, l.like_count;
  `;
};

export const UpdateRecipeModels = async (params: UpdateRecipeType) => {
  return await connect`
      UPDATE public.recipe
      SET title = ${params?.title},
      ingredients = ${params?.ingredients},
      image_recipe = ${params?.image_recipe},
      category_id = ${params?.category_id}
      WHERE id = ${params?.id ?? 0}
      RETURNING *;
    `;
};

export const DeleteRecipeModels = async (id: string) => {
  await connect`DELETE FROM public.recipe WHERE id=${id}`;
};
