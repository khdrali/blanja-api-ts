import db from "../../db";
import { ResetPasswordType } from "./type";

export const RequestResetPasswordModels = async (data: ResetPasswordType) => {
  return await db`INSERT INTO public.reset_password(user_id,token,created_at) VALUES ((SELECT id FROM public.user WHERE email = ${data?.email}),${data?.token},${data?.created_at})`;
};

export const ResetPasswordUsedModels = async (token: string) => {
  return await db`UPDATE reset_password SET is_used=true WHERE token=${token}`;
};

export const GetDataResetPasswordModels = async (token: string) => {
  return await db`SELECT * FROM reset_password WHERE token=${token}`;
};
