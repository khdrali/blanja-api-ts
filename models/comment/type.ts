export interface CommentType {
  comment: string;
  recipe_id: string;
  user_id: string;
  created_at: Date;
}

export interface DeleteCommentType {
  id: string;
  user_id: string;
}
