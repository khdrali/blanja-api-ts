import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { errorResponse } from "../utils/sendResponse";

dotenv.config();

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      res
        .status(401)
        .json(errorResponse(req, "No Token Provided", 401, "error"));
    }

    const token = authorization?.replace("Bearer ", "");

    // Gunakan Promisify untuk jwt.verify jika diperlukan async
    jwt.verify(
      token ?? "",
      process.env.SECRET_KEY as string,
      (err: any, decoded) => {
        if (err) {
          return res
            .status(401)
            .json(errorResponse(req, "Invalid Token", 401, "error"));
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

// export const optionalAuth = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     const token = authHeader.split(" ")[1];

//     try {
//       const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as {
//         id: number;
//         email?: string;
//       };

//       req.user = decoded;
//     } catch (err) {
//       console.log("Invalid token:", err);
//     }
//   }

//   next();
// };
