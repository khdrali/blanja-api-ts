import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401).json({
        valid: false,
        status: 401,
        message: "No token provided",
      });
    }

    const token = authorization?.replace("Bearer ", "");

    // Gunakan Promisify untuk jwt.verify jika diperlukan async
    jwt.verify(
      token ?? "",
      process.env.SECRET_KEY as string,
      (err: any, decoded) => {
        if (err) {
          return res.status(401).json({
            valid: false,
            status: 401,
            message: "Invalid Token",
          });
        }

        req.user = decoded as { id: number; email?: string };
        next();
      }
    );
  } catch (error) {
    res.status(500).json({
      valid: false,
      status: 500,
      message: "Server error",
      data: [],
    });
  }
};
