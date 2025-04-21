import db from "../../db";
import { CommentType, DeleteCommentType } from "./type";

export const CreateCommentRecipeModels = async (params: CommentType) => {
  await db`INSERT INTO public.comments (comment,recipe_id,user_id,created_at) VALUES (${params?.comment},${params?.recipe_id},${params?.user_id},${params?.created_at})`;
};

export const DeleteCommentRecipeModels = async (params: DeleteCommentType) => {
  const result =
    await db`DELETE FROM public.comments WHERE id=${params?.id} AND user_id=${params?.user_id} RETURNING *`;

  return result;
};

export const GetCommentsByRecipeIdModels = async (
  recipeId: string,
  limit: number,
  offset: number
) => {
  const comments = await db`
    SELECT 
      c.id AS comment_id,
      c.comment,
      c.recipe_id,
      c.user_id,
      c.created_at,
      u.id AS user_id,
      u.username AS user_username,
      u.photo AS user_photo
    FROM 
      public.comments c
    JOIN 
      public.user u ON c.user_id = u.id
    WHERE 
      c.recipe_id = ${recipeId}
    ORDER BY 
      c.created_at DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  const count = await db`
    SELECT COUNT(*) AS total
    FROM public.comments
    WHERE recipe_id = ${recipeId}
  `;

  return {
    total_rows: Number(count[0]?.total) || 0,
    rows: comments,
  };
};
