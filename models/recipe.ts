import connect from "../db";
import { CreateRecipeType, CreateVideoType } from "./type";

// export const CreateRecipeModels = async (params: CreateRecipeType) => {
//   return await db`
//     INSERT INTO public.recipe (title, ingredients, image_recipe, user_id, created_at)
//     VALUES (${params?.title}, ${params?.ingredients}, ${params?.image_recipe}, ${params?.user_id}, ${params?.created_at})`;
// };
export const CreateRecipeModels = async (params: CreateRecipeType) => {
  const result = await connect`
    INSERT INTO public.recipe (title, ingredients, image_recipe, user_id, created_at)
    VALUES (${params.title}, ${params.ingredients}, ${params.image_recipe}, ${params.user_id}, ${params.created_at})
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
