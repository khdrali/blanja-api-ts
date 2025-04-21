import {
  requestOtpModels,
  updateOtpUsed,
  verifyOtp,
} from "../../models/otp/otp";
import { sendMail } from "../../utils/nodemailer";
import { generateOTP } from "../../utils/otp";
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
} from "../../models/user/user";
import { errorResponse, sendResponses } from "../../utils/sendResponse";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const checkEmail = await getUserByEmail(email);
    if (checkEmail.length === 0) {
      res
        .status(404)
        .json(errorResponse(req, "Email not registred", 404, "error"));
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
        res
          .status(200)
          .json(
            sendResponses(req, { token: token }, "Login Successfully", 200)
          );
        return; // Exit the function after sending the response
      } else {
        res
          .status(400)
          .json(
            errorResponse(req, "Incorrect Email or Password", 400, "error")
          );
        return; // Exit the function after sending the response
      }
    } else {
      res
        .status(400)
        .json(errorResponse(req, "Account not actived", 400, "error"));
    }
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(req, "Internal Server Error", 500, "error"));
  }
};

export const requestOtpController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    const uuid = uuidv4();
    const date = new Date();

    const respData = {
      otp_code: otp,
      unique_code: uuid,
    };
    await requestOtpModels({
      otp_code: otp,
      unique_code: uuid,
      email,
      created_at: date,
    });
    res
      .status(200)
      .json(
        sendResponses(
          req,
          respData,
          "Check your email to verify your account",
          200
        )
      );
    const subject = "Email Verification";
    const message = `Your OTP code is: ${otp}`;
    sendMail(email, subject, message);
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(req, "Internal Server Error", 500, "error"));
  }
};

export const verifyOtpController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { otp_code, unique_code, email } = req.body;

  try {
    if (!otp_code || !email) {
      res
        .status(400)
        .json(
          errorResponse(req, "OTP code and email are required", 400, "error")
        );
      return;
    }

    const otpResult = await verifyOtp({ otp_code, unique_code, email });
    if (otpResult.length === 0) {
      res.status(400).json(errorResponse(req, "Invalid OTP", 400, "error"));
      return;
    }

    const { user_id, created_at } = otpResult[0];
    const expirationTime = new Date(created_at);
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    if (new Date() > expirationTime) {
      res.status(400).json(errorResponse(req, "OTP has Expired", 400, "error"));
      return;
    }

    const isActive = await checkUserActive(user_id);
    if (isActive) {
      res
        .status(400)
        .json(errorResponse(req, "Account is already active", 400, "error"));
      return;
    }

    await UpdateUserActive(user_id);
    await updateOtpUsed(otp_code);

    res
      .status(200)
      .json(
        sendResponses(req, null, "Account has been successfully actived", 200)
      );
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(req, "Internal Server Error", 500, "error"));
  }
};
