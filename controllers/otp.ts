import { requestOtpModels } from "../models/otp";
import { sendMail } from "../utils/nodemailer";
import { v4 as uuidv4 } from "uuid";
import { generateOTP } from "../utils/otp";
import { Request, Response } from "express";

export const requestOtpController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    const code = uuidv4();
    const date = new Date();
    await requestOtpModels({
      otp_code: otp,
      unique_code: code,
      email,
      created_at: date,
    });

    res.json({
      valid: true,
      status: 200,
      message: "Check your email to verify your account",
    });
    const subject = "Email Verification";
    const message = `Your OTP code is: ${otp}`;
    sendMail(email, subject, message);
  } catch (error) {
    res.json({
      valid: false,
      status: 500,
      message: error,
      data: [],
    });
  }
};
