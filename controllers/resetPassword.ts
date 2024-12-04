import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { RequestResetPasswordModels } from "../models/resetPassword";
import { sendMail } from "../utils/nodemailer";

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
