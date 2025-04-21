import db from "../../db";
import { LimitType } from "../type";
import {
  CreateType,
  ChangeResetPasswordType,
  UpdateUserProfileType,
} from "./type";

export const GetAllUserModels = async (data: LimitType) => {
  // Query untuk mengambil data user
  const query = `${data.sort} LIMIT ${data?.limit} OFFSET ${data?.offset}`;
  const users = await db`SELECT * FROM public.user ORDER BY ${query}`;

  // Query untuk menghitung total rows
  const countResult = await db`SELECT COUNT(*) AS total_rows FROM public.user `;

  return {
    total_rows: countResult[0]?.total_rows || 0,
    rows: users,
  };
};

export const GetUserByIdModels = async (id: string) => {
  return await db`SELECT * FROM public.user WHERE id = ${id}`;
};

export const getUserByEmail = async (email: string) => {
  return await db`SELECT * FROM public.user WHERE email=${email}`;
};

export const CreateUserController = async (params: CreateType) => {
  return await db`INSERT INTO public.user(username,email,password,phone,photo) VALUES (${
    params?.username
  },${params?.email},${params?.password},${params?.phone},${
    params?.photo ?? null
  }) RETURNING *`;
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
  return await db`UPDATE public.user SET username=${params?.username}, phone=${params?.phone},photo=${params?.photo} WHERE id=${params?.id}`;
};

export const ChangePasswordModels = async (data: ChangeResetPasswordType) => {
  return await db`UPDATE public.user SET password=${data?.new_password} WHERE id=${data?.id}`;
};
