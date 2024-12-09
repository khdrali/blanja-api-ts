import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  valid: boolean,
  message: string,
  data?: any
): void => {
  res.status(statusCode).json({
    valid,
    status: statusCode,
    message,
    data,
  });
};
