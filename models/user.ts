import db from "../db";
import {
  ChangeResetPasswordType,
  CreateType,
  UpdateUserProfileType,
} from "./type";

export const GetAllUserModels = async () => {
  return await db`SELECT * FROM public.user`;
};

export const GetUserByIdModels = async (id: string) => {
  return await db`SELECT * FROM public.user WHERE id = ${id}`;
};

export const getUserByEmail = async (email: string) => {
  return await db`SELECT * FROM public.user WHERE email=${email}`;
};

export const CreateUserController = async (params: CreateType) => {
  if (!params?.photo) {
    return await db`INSERT INTO public.user(username,email,password,phone) VALUES (${params?.username},${params?.email},${params?.password},${params?.phone})`;
  } else {
    return await db`INSERT INTO public.user(username,email,password,phone,photo) VALUES (${params?.username},${params?.email},${params?.password},${params?.phone},${params?.photo})`;
  }
};

export const checkUserActive = async (user_id: number) => {
  const result =
    await db`SELECT public.user.is_active FROM public.user WHERE id=${user_id}`;
  return result[0]?.is_active ?? false;
};

export const UpdateUserActive = async (user_id: number) => {
  return await db`
    UPDATE public.user
    SET is_active = true
    WHERE id = ${user_id}
  `;
};

export const ChangeResetPasswordModels = async (
  data: ChangeResetPasswordType
) => {
  return await db`UPDATE public.user SET password=${data?.new_password} WHERE id=${data?.id}`;
};

export const UpdateUserProfileModels = async (
  params: UpdateUserProfileType
) => {
  return await db`UPDATE public.user SET username=${params?.username}, phone=${params?.phone} WHERE id=${params?.id}`;
};
