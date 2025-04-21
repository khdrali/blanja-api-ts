import connect from "../../db";
import { CreateVideoType, UpdateVideoType } from "./type";

export const GetVideosByRecipeId = async (recipe_id: number) => {
  return await connect`
    SELECT id, video_url 
    FROM public.video 
    WHERE recipe_id = ${recipe_id};
  `;
};

export const UpdateVideosModels = async (params: UpdateVideoType) => {
  return await connect`
          UPDATE public.video
          SET video_url = ${params?.video_url}
          WHERE id = ${params?.id}
          RETURNING *;
        `;
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

export const DeleteVideoModels = async (id: number[]) => {
  if (id.length === 0) return [];

  return await connect` DELETE FROM public.video
    WHERE id IN ${connect(id)}
    RETURNING *;`;
};

export const DeleteVideoByRecipeIdModels = async (id: string) => {
  await connect`DELETE FROM public.video WHERE recipe_id=${id}`;
};
