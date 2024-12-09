import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Request, Response } from "express";
import {
  CreateUserController,
  GetAllUserModels,
  getUserByEmail,
  GetUserByIdModels,
} from "../models/user";
import { sendResponse } from "../utils/sendResponse";
dotenv.config();
const saltrounds = 10;

export const GetAllUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const resAllUser = await GetAllUserModels();
    sendResponse(res, 200, true, "Successfully Get Data", resAllUser);
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error", []);
  }
};

export const CreateUserControllers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, phone } = req.body;
    const checkEmail = await getUserByEmail(email);
    if (checkEmail?.length >= 1) {
      sendResponse(res, 401, false, "Email already exist");
    }
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      if (err) {
        sendResponse(res, 500, false, "Authentication Failed");
      }
      await CreateUserController({
        username: username,
        email: email,
        password: hash,
        phone: phone,
      });
      sendResponse(
        res,
        200,
        true,
        "Successfully create account!, please check your email for verfication your account"
      );
    });
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error", []);
  }
};

export const GetUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req?.params;
    if (typeof id !== "string") {
      sendResponse(res, 400, false, "ID parameter must be a string");
    }

    const result = await GetUserByIdModels(id);
    if (result && result.length > 0) {
      sendResponse(res, 200, true, "Successfully Get User", result);
    } else {
      sendResponse(res, 404, false, "User Not Found", []);
    }
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error", []);
  }
};
