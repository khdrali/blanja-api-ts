import db from "../db";
import { CreateType } from "./type";

export const GetAllUserModels = async () => {
  return await db`SELECT * FROM public.user`;
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
