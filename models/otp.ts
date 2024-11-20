import db from "../db.js";
import { RequestOtpType } from "./type.js";

export const requestOtpModels = async (params: RequestOtpType) => {
  return await db`INSERT INTO public.otp_request (otp_code, unique_code, user_id, created_at) 
  VALUES (${params?.otp_code}, ${params?.unique_code}, 
    (SELECT id FROM public.user WHERE email = ${params?.email}), ${params?.created_at}
  )`;
};
