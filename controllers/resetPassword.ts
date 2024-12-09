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
    res.json({
      valid: true,
      status: 200,
      message: "Check your email to Reset Password",
    });
    const subject = "Reset Password";
    const meesage = `<a href=http://localhost:3000/${token}>Click here</a> to reset password`;
    sendMail(email, subject, meesage);
  } catch (error) {
    res.json({
      valid: false,
      status: 500,
      message: error,
    });
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
      res.status(400).json({
        valid: false,
        status: 400,
        message: "Password & Confirm password doesn't match",
      });
      return;
    }

    if (typeof token !== "string" || !token) {
      res.status(400).json({
        valid: false,
        status: 400,
        message: "Invalid token format",
      });
      return;
    }

    const checkTokenUser = await GetDataResetPasswordModels(token as string);
    if (!checkTokenUser || checkTokenUser.length === 0) {
      res.status(404).json({
        valid: false,
        status: 404,
        message: "Invalid Token",
      });
      return;
    }

    const { user_id, is_used, created_at } = checkTokenUser[0];

    if (is_used) {
      res.status(400).json({
        valid: false,
        status: 400,
        message: "Token has already been used",
      });
      return;
    }

    const expiredToken = new Date(created_at);
    expiredToken.setMinutes(expiredToken.getMinutes() + 10);
    if (new Date() > expiredToken) {
      res.status(400).json({
        valid: false,
        status: 400,
        message: "Token Expired",
      });
      return;
    }

    const hashPassword = await bcrypt.hash(new_password, saltrounds);

    await ChangeResetPasswordModels({
      new_password: hashPassword,
      id: user_id,
    });

    await ResetPasswordUsedModels(token as string);

    res.status(200).json({
      valid: true,
      status: 200,
      message: "Successfully Changed Password",
    });
  } catch (error) {
    res.status(500).json({
      valid: false,
      status: 500,
      message: error,
    });
  }
};
