export interface CreateType {
  username: string;
  email: string;
  password: string;
  phone: string;
  photo?: string;
}

export interface RequestOtpType {
  otp_code: string;
  email: string;
  created_at: Date;
}

export interface verifyOtpType {
  otp_code: string;
  email: string;
}

export interface CreateRecipeType {
  title: string;
  ingredients: string;
  image_recipe: string;
  user_id: number;
  created_at: Date;
}

export interface CreateVideoType {
  video_url: string | string[];
  recipe_id: number;
}
