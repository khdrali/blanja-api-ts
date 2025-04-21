import express from "express";
import { validateToken } from "../../middlewares/validate-token";
import {
  CreateCommentRecipeController,
  DeleteCommentRecipeController,
  GetCommentRecipeController,
} from "../../controllers/comment/comment";

const CommentRoutes = express.Router();

CommentRoutes.post(
  "/comment-recipe",
  validateToken,
  CreateCommentRecipeController
);
CommentRoutes.get(
  "/get-comment-recipe/:id",
  validateToken,
  GetCommentRecipeController
);
CommentRoutes.delete(
  "/delete-comment-recipe/:id",
  validateToken,
  DeleteCommentRecipeController
);

export default CommentRoutes;
