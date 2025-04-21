export interface CreateVideoType {
  video_url: string | string[];
  recipe_id: number;
}

export interface UpdateVideoType {
  id: number;
  video_url: string | string[];
}
