import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Request, Response } from "express";
import {
  ChangePasswordModels,
  CreateUserController,
  GetAllUserModels,
  getUserByEmail,
  GetUserByIdModels,
  UpdateUserProfileModels,
} from "../../models/user/user";
import {
  Data,
  errorResponse,
  sendResponsePaginate,
  sendResponses,
} from "../../utils/sendResponse";
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
      sort: "",
      limit: String(limit),
      offset: String(offset),
    });
    const totalPage = Math.ceil(resAllUser.total_rows / limit);
    const responseData: Data = {
      limit: limit,
      page: page,
      sort: "",
      total_page: totalPage,
      total_rows: Number(resAllUser.total_rows),
      rows: resAllUser?.rows,
    };

    res
      .status(200)
      .json(
        sendResponsePaginate(req, responseData, "Successfully Get Data", 200)
      );
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
    const { username, email, password, phone, confirm_password } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const checkEmail = await getUserByEmail(email);
    if (checkEmail?.length >= 1) {
      res
        .status(401)
        .json(errorResponse(req, "Email Already Exist", 401, "Unauthorized"));
      return;
    }
    if (password !== confirm_password) {
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
    const image_Profile = files.photo
      ? `/uploads/images/${files.photo[0].filename}`
      : null;
    bcrypt.hash(password, saltrounds, async (err, hash) => {
      if (err) {
        res
          .status(500)
          .json(errorResponse(req, "Authentichation failed", 500, "error"));
        return;
      }

      await CreateUserController({
        username: username,
        email: email,
        password: hash,
        phone: phone,
        photo: image_Profile,
      });

      res
        .status(200)
        .json(
          sendResponses(
            req,
            null,
            "Successfully create account!, please check your email for verfication your account",
            200
          )
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
      return;
    }

    const result = await GetUserByIdModels(id);
    if (result && result.length > 0) {
      res
        .status(200)
        .json(sendResponses(req, result, "Successfully Get User", 200));
      return;
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
): Promise<void> => {
  try {
    const { username, phone } = req?.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { id } = req?.params;
    const image_Profile = files.photo
      ? `/uploads/images/${files.photo[0].filename}`
      : null;
    if (Number(id) !== req.user?.id) {
      res.status(400).json(errorResponse(req, "Unathorized", 400, "error"));
      return;
    }
    const getUserId = await GetUserByIdModels(id);
    if (!getUserId) {
      res.status(404).json(errorResponse(req, "User Not Found", 404, "error"));
      return;
    } else {
      const UpdatedUser = await UpdateUserProfileModels({
        username:
          !username || username == "" ? getUserId[0].username : username,
        phone: !phone || phone == "" ? getUserId[0].phone : phone,
        photo: !files ? getUserId[0].photo : image_Profile,
        id: Number(id),
      });
      res
        .status(200)
        .json(sendResponses(req, null, "Successfuly update data", 200));
    }
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(req, "Internal Server Error", 500, "error"));
  }
};

export const ChangePasswordControllers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { old_password, new_password, confirm_password } = req?.body;
    const { id } = req.params;
    if (Number(id) !== req.user?.id) {
      res.status(400).json(errorResponse(req, "Unathorized", 400, "error"));
      return;
    }
    const getUserId = await GetUserByIdModels(id);
    if (!getUserId) {
      res.status(404).json(errorResponse(req, "User Not Found", 404, "error"));
      return;
    }

    const checkOldPassword = await bcrypt.compare(
      old_password,
      getUserId[0].password
    );

    if (!checkOldPassword) {
      res
        .status(400)
        .json(errorResponse(req, "Current Password Incorrect", 400, "error"));
      return;
    }
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
    const saltrounds = 10;
    const hashNewPassword = await bcrypt.hash(new_password, saltrounds);
    await ChangePasswordModels({
      id: Number(id),
      new_password: hashNewPassword,
    });
    res
      .status(200)
      .json(sendResponses(req, null, "Successfully Update Password", 200));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(req, "Internal Server Error", 500, "error"));
  }
};
