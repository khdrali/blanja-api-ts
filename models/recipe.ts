import connect from "../db";
import { CreateRecipeType, CreateVideoType, GetDataType } from "./type";

export const CreateRecipeModels = async (params: CreateRecipeType) => {
  const result = await connect`
    INSERT INTO public.recipe (title, ingredients, image_recipe, user_id, created_at, category_id)
    VALUES (${params.title}, ${params.ingredients}, ${params.image_recipe}, ${params.user_id}, ${params.created_at},${params?.category_id})
    RETURNING *`;

  return result[0];
};

export const CreateVideoModels = async (params: CreateVideoType) => {
  if (Array.isArray(params.video_url)) {
    // Jika ada banyak video
    const videoValues = params.video_url.map((url: string) => [
      url,
      params.recipe_id,
    ]);

    // Menggunakan template literal postgres dengan benar
    const result = await connect`
      INSERT INTO public.video (video_url, recipe_id)
      VALUES ${connect(videoValues)}
    `;

    return result;
  } else {
    // Jika hanya ada satu video
    const result = await connect`
      INSERT INTO public.video (video_url, recipe_id)
      VALUES (${params.video_url}, ${params.recipe_id})
    `;

    return result;
  }
};

export const GetAllRecipeModels = async () => {
  const result = await connect`
    SELECT 
      r.id AS recipe_id,
      r.title,
      r.ingredients,
      r.image_recipe,
      r.user_id,
      r.created_at,
      COALESCE(json_agg(v.video_url), '[]') AS videos
    FROM 
      public.recipe r
    LEFT JOIN 
      public.video v 
    ON 
      r.id = v.recipe_id
    GROUP BY 
      r.id, r.title, r.ingredients, r.image_recipe, r.user_id, r.created_at
    LIMIT 10
      `;
  return result;
};

export const GetRecipeByIdModels = async (id: string) => {
  return await connect`SELECT 
  r.id AS recipe_id,
  r.title,
  r.ingredients,
  r.image_recipe,
  r.user_id,
  r.created_at,
  COALESCE(json_agg(v.video_url), '[]') AS videos
FROM 
  public.recipe r
LEFT JOIN 
  public.video v 
ON 
  r.id = v.recipe_id
WHERE 
  r.id = ${id}
GROUP BY 
  r.id, r.title, r.ingredients, r.image_recipe, r.user_id, r.created_at;
`;
};

export const GetRecipeByUserIdModels = async (id: string) => {
  return await connect`
  SELECT 
    r.id AS recipe_id,
    r.title,
    r.ingredients,
    r.image_recipe,
    r.user_id,
    r.created_at,
    COALESCE(json_agg(v.video_url), '[]') AS videos
  FROM 
    public.recipe r
  LEFT JOIN 
    public.video v 
  ON 
    r.id = v.recipe_id
  WHERE 
    r.user_id = ${id}
  GROUP BY 
    r.id, r.title, r.ingredients, r.image_recipe, r.user_id, r.created_at;
  `;
};
