import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Request, Response } from "express";
import {
  CreateUserController,
  GetAllUserModels,
  getUserByEmail,
  GetUserByIdModels,
} from "../models/user";
import {
  Data,
  errorResponse,
  sendResponse,
  sendResponses,
} from "../utils/sendResponse";
dotenv.config();
const saltrounds = 10;

export const GetAllUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = 10;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const resAllUser = await GetAllUserModels({
      sort: "id DESC",
      limit: String(limit),
      offset: String(offset),
    });
    const totalPage = Math.ceil(resAllUser.total_rows / limit);
    const responseData: Data = {
      limit: limit,
      page: page,
      sort: "id Desc",
      total_page: totalPage,
      total_rows: Number(resAllUser.total_rows),
      rows: resAllUser?.rows,
    };

    // sendResponse(res, 200, true, "Successfully Get Data", resAllUser);
    res
      .status(200)
      .json(sendResponses(req, responseData, "Successfully Get Data", 200));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(req, "Internal Server Error", 500, "error"));
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
    res
      .status(500)
      .json(errorResponse(req, "Internal Server Error", 500, "error"));
  }
};

export const GetUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req?.params;
    if (typeof id !== "string") {
      // sendResponse(res, 400, false, "ID parameter must be a string");
      res
        .status(400)
        .json(errorResponse(req, "Params id is required", 400, "bad_request"));
    }

    const result = await GetUserByIdModels(id);
    if (result && result.length > 0) {
      res
        .status(200)
        .json(sendResponses(req, result, "Successfully Get User", 200));
    } else {
      // sendResponse(res, 404, false, "User Not Found", []);
      res
        .status(404)
        .json(errorResponse(req, "User Not Found", 404, "not_found"));
    }
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(req, "Internal Server Error", 500, "error"));
  }
};

export const UpdateUserProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const { username, phone } = req?.body;
    const { id } = req?.params;
    if (Number(id) !== req.user?.id) {
      sendResponse(res, 400, false, "Unauthorized");
    }
  } catch (error) {}
};
