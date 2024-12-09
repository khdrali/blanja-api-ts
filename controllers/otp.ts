import { requestOtpModels, updateOtpUsed, verifyOtp } from "../models/otp";
import { sendMail } from "../utils/nodemailer";
import { generateOTP } from "../utils/otp";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {
  checkUserActive,
  getUserByEmail,
  UpdateUserActive,
} from "../models/user";
import { sendResponse } from "../utils/sendResponse";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const checkEmail = await getUserByEmail(email);
    if (checkEmail.length === 0) {
      sendResponse(res, 404, false, "Email not registred");
      return; // Exit the function after sending the response
    }
    const checkUserActive = checkEmail.find((v) => v?.is_active)?.is_active;
    if (checkUserActive) {
      const passwordMatch = await bcrypt.compare(
        password,
        checkEmail[0].password
      );

      if (passwordMatch) {
        const token = jwt.sign(
          {
            id: checkEmail[0]?.id,
            username: checkEmail[0]?.username,
            email: checkEmail[0]?.email,
            iat: Math.floor(Date.now() / 1000) - 30,
          },
          String(process.env.SECRET_KEY),
          { expiresIn: "1h" }
        );

        sendResponse(res, 200, true, "Login Successfully", { token: token });
        return; // Exit the function after sending the response
      } else {
        sendResponse(res, 400, false, "Incorrect Email or Password");
        return; // Exit the function after sending the response
      }
    } else {
      sendResponse(res, 400, false, "Account not actived");
    }
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error");
  }
};

export const requestOtpController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    const uuid = uuidv4();
    const date = new Date();
    await requestOtpModels({
      otp_code: otp,
      unique_code: uuid,
      email,
      created_at: date,
    });

    sendResponse(res, 200, true, "Check your email to verify your account");
    const subject = "Email Verification";
    const message = `Your OTP code is: ${otp}`;
    sendMail(email, subject, message);
  } catch (error) {
    sendResponse(res, 500, false, "Internal Server Error");
  }
};

export const verifyOtpController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { otp_code, unique_code, email } = req.body;

  try {
    if (!otp_code || !email) {
      sendResponse(res, 400, false, "OTP code and email are required");
      return;
    }

    const otpResult = await verifyOtp({ otp_code, unique_code, email });
    if (otpResult.length === 0) {
      sendResponse(res, 400, false, "Invalid OTP");
      return;
    }

    const { user_id, created_at } = otpResult[0];
    const expirationTime = new Date(created_at);
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    if (new Date() > expirationTime) {
      sendResponse(res, 400, false, "OTP has expired");
      return;
    }

    const isActive = await checkUserActive(user_id);
    if (isActive) {
      sendResponse(res, 400, false, "Account is already active");
      return;
    }

    await UpdateUserActive(user_id);
    await updateOtpUsed(otp_code);

    sendResponse(res, 200, true, "Account has been successfully actived");
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error");
  }
};
