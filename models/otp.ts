import db from "../db";
import { RequestOtpType, verifyOtpType } from "./type";

export const requestOtpModels = async (params: RequestOtpType) => {
  return await db`INSERT INTO public.otp_request (otp_code, user_id, created_at) 
  VALUES (${params?.otp_code}, 
    (SELECT id FROM public.user WHERE email = ${params?.email}), ${params?.created_at}
  )`;
};

export const verifyOtp = async (params: verifyOtpType) => {
  const result = await db`
      SELECT otp_request.user_id, otp_request.created_at 
      FROM otp_request
      JOIN "user" ON otp_request.user_id = "user".id 
      WHERE otp_request.otp_code = ${params?.otp_code} 
        AND "user".email = ${params?.email} 
        AND otp_request.is_used = false
    `;

  return result;
};

export const updateOtpUsed = async (otp_code: string) => {
  return await db`
    UPDATE otp_request
    SET is_used = true
    WHERE otp_code = ${otp_code}
  `;
};
