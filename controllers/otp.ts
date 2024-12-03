import { requestOtpModels, updateOtpUsed, verifyOtp } from "../models/otp";
import { sendMail } from "../utils/nodemailer";
import { generateOTP } from "../utils/otp";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {
  checkUserActive,
  getUserByEmail,
  UpdateUserActive,
} from "../models/user";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const checkEmail = await getUserByEmail(email);
    if (checkEmail.length === 0) {
      res.status(404).json({
        valid: false,
        status: 404,
        message: "Email not registered",
      });
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

        res.status(200).json({
          valid: true,
          status: 200,
          message: "Login successfully",
          data: { token: token },
        });
        return; // Exit the function after sending the response
      } else {
        res.status(400).json({
          valid: false,
          status: 400,
          message: "Incorrect Email or Password",
        });
        return; // Exit the function after sending the response
      }
    } else {
      res?.status(400)?.json({
        valid: false,
        status: 400,
        message: "Account not actived",
      });
    }
  } catch (error) {
    res.status(500).json({
      valid: false,
      status: 500,
      message: error || "Internal server error",
    });
  }
};

export const requestOtpController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    const date = new Date();
    await requestOtpModels({
      otp_code: otp,
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

export const verifyOtpController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { otp_code, email } = req.body;

  try {
    if (!otp_code || !email) {
      res.status(400).json({
        valid: false,
        status: 400,
        message: "OTP code and email are required",
      });
      return;
    }

    const otpResult = await verifyOtp({ otp_code, email });
    if (otpResult.length === 0) {
      res.status(400).json({
        valid: false,
        status: 400,
        message: "Invalid OTP",
      });
      return;
    }

    const { user_id, created_at } = otpResult[0];
    const expirationTime = new Date(created_at);
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    if (new Date() > expirationTime) {
      res.status(400).json({
        valid: false,
        status: 400,
        message: "OTP has expired",
      });
      return;
    }

    const isActive = await checkUserActive(user_id);
    if (isActive) {
      res.status(400).json({
        valid: false,
        status: 400,
        message: "Account is already active",
      });
      return;
    }

    await UpdateUserActive(user_id);
    await updateOtpUsed(otp_code);

    res.status(200).json({
      valid: true,
      status: 200,
      message: "Account has been successfully activated",
    });
  } catch (error) {
    console.error("Error in verifyOtpController:", error);
    res.status(500).json({
      valid: false,
      status: 500,
      message: "Internal server error",
    });
  }
};
