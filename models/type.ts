export interface CreateType {
  username: string;
  email: string;
  password: string;
  phone: string;
  photo?: string;
}

export interface RequestOtpType {
  otp_code: string;
  unique_code: string;
  email: string;
  created_at: Date;
}

export interface verifyOtpType {
  otp_code: string;
  unique_code: string;
  email: string;
}

export interface CreateRecipeType {
  title: string;
  ingredients: string;
  image_recipe: string | null;
  user_id: number;
  created_at: Date;
  category_id: number;
}

export interface CreateVideoType {
  video_url: string | string[];
  recipe_id: number;
}

export interface GetDataType {
  recipe_id: number;
  title: string;
  ingredients: string;
  image_recipe: string;
  user_id: string;
  created_at: Date;
  video_url: string | string[];
}

export interface ResetPasswordType {
  email: string;
  token: string;
  created_at: Date;
}

export interface ChangeResetPasswordType {
  new_password: string;
  id: number;
}

export interface UpdateUserProfileType {
  id: number;
  username: string;
  phone: string;
}

export interface LimitType {
  sort: string;
  limit: string;
  offset: string;
}
