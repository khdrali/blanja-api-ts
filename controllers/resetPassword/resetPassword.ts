import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  GetDataResetPasswordModels,
  RequestResetPasswordModels,
  ResetPasswordUsedModels,
} from "../../models/resetPassword/resetPassword";
import { sendMail } from "../../utils/nodemailer";
import bcrypt from "bcrypt";
import { ChangeResetPasswordModels } from "../../models/user/user";
import { errorResponse, sendResponses } from "../../utils/sendResponse";
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
    res
      .status(200)
      .json(
        sendResponses(req, null, "Check your email to reset password", 200)
      );
    const subject = "Reset Password";
    const meesage = `<a href=http://localhost:3000/reset-password?token=${token}>Click here</a> to reset password`;
    sendMail(email, subject, meesage);
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(req, "Internal Server Error", 500, "error"));
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
      res
        .status(400)
        .json(
          errorResponse(
            req,
            "Password & Confirm password doesn't match",
            400,
            "error"
          )
        );
      return;
    }

    if (typeof token !== "string" || !token) {
      res
        .status(400)
        .json(errorResponse(req, "Invalid token format", 400, "error"));
      return;
    }

    const checkTokenUser = await GetDataResetPasswordModels(token as string);
    if (!checkTokenUser || checkTokenUser.length === 0) {
      res.status(404).json(errorResponse(req, "Invalid Token", 404, "error"));
      return;
    }

    const { user_id, is_used, created_at } = checkTokenUser[0];

    if (is_used) {
      res
        .status(400)
        .json(errorResponse(req, "Token has already been used", 400, "error"));
      return;
    }

    const expiredToken = new Date(created_at);
    expiredToken.setMinutes(expiredToken.getMinutes() + 10);
    if (new Date() > expiredToken) {
      res.status(400).json(errorResponse(req, "Token Expired", 400, "error"));
      return;
    }

    const hashPassword = await bcrypt.hash(new_password, saltrounds);

    await ChangeResetPasswordModels({
      new_password: hashPassword,
      id: user_id,
    });

    await ResetPasswordUsedModels(token as string);
    res
      .status(200)
      .json(sendResponses(req, null, "Successfully Changed Password", 200));
  } catch (error) {
    res.status(500).json(errorResponse(req, error as string, 500, "error"));
  }
};
