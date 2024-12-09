import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  GetDataResetPasswordModels,
  RequestResetPasswordModels,
  ResetPasswordUsedModels,
} from "../models/resetPassword";
import { sendMail } from "../utils/nodemailer";
import bcrypt from "bcrypt";
import { ChangeResetPasswordModels } from "../models/user";
import { sendResponse } from "../utils/sendResponse";
const saltrounds = 10;

export const RequestResetPasswordControllers = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req?.body;
    const date = new Date();
    const token = uuidv4();

    await RequestResetPasswordModels({ email, token, created_at: date });
    sendResponse(res, 200, true, "Check your email to reset password");
    const subject = "Reset Password";
    const meesage = `<a href=http://localhost:3000/reset-password?token=${token}>Click here</a> to reset password`;
    sendMail(email, subject, meesage);
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error");
  }
};

export const ChangeResetPasswordControllers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { new_password, confirm_password } = req.body;
    const { token } = req?.query;

    if (new_password !== confirm_password) {
      sendResponse(
        res,
        400,
        false,
        "Password & Confirm password doesn't match"
      );
      return;
    }

    if (typeof token !== "string" || !token) {
      sendResponse(res, 400, false, "Invalid token format");
      return;
    }

    const checkTokenUser = await GetDataResetPasswordModels(token as string);
    if (!checkTokenUser || checkTokenUser.length === 0) {
      sendResponse(res, 404, false, "Invalid Token");
      return;
    }

    const { user_id, is_used, created_at } = checkTokenUser[0];

    if (is_used) {
      sendResponse(res, 400, false, "Token has already been used");
      return;
    }

    const expiredToken = new Date(created_at);
    expiredToken.setMinutes(expiredToken.getMinutes() + 10);
    if (new Date() > expiredToken) {
      sendResponse(res, 400, false, "Token Expired");
      return;
    }

    const hashPassword = await bcrypt.hash(new_password, saltrounds);

    await ChangeResetPasswordModels({
      new_password: hashPassword,
      id: user_id,
    });

    await ResetPasswordUsedModels(token as string);
    sendResponse(res, 200, true, "Successfully Changed Password");
  } catch (error) {
    sendResponse(res, 500, false);
  }
};
