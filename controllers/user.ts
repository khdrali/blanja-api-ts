import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Request, Response } from "express";
import {
  CreateUserController,
  GetAllUserModels,
  getUserByEmail,
} from "../models/user";
dotenv.config();
const saltrounds = 10;

export const GetAllUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const resAllUser = await GetAllUserModels();
    res.json({
      valid: true,
      status: 200,
      message: "Successfully Get Data",
      data: resAllUser,
    });
  } catch (error) {
    res.json({
      valid: false,
      status: 500,
      message: error,
      data: [],
    });
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
      res.json({
        valid: false,
        status: 401,
        message: "Email already exist",
      });
    }
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      if (err) {
        return {
          valid: false,
          status: 500,
          message: "Authentication Failed",
        };
      }
      await CreateUserController({
        username: username,
        email: email,
        password: hash,
        phone: phone,
      });
      res.json({
        valid: true,
        status: 200,
        message:
          "Successfully create account!, please check your email for verfication your account",
      });
    });
  } catch (error) {
    res.json({
      valid: false,
      status: 500,
      message: error,
      data: [],
    });
  }
};