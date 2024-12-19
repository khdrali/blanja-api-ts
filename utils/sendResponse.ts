import { Request, Response } from "express";

interface Details {
  path: string;
  query: any;
  status_code: number;
  method: string;
  status: string;
}

export interface Data {
  limit: number;
  page: number;
  sort: string;
  total_rows: number;
  total_page: number;
  rows: any;
}

interface ApiResponsePaginate {
  details: Details;
  valid: boolean;
  data: Data;
  errors: any;
  message: string;
}

interface ApiResponse {
  details: Details;
  valid: boolean;
  data: any;
  error: any;
  message: string;
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  valid: boolean,
  messageRes?: string,
  data?: any
): void => {
  res.status(statusCode).json({
    valid,
    status: statusCode,
    message: messageRes ?? "Internal Server Error",
    data,
  });
};

export function sendResponses(
  req: Request,
  data: any,
  message: string,
  statusCode: number
): ApiResponse {
  return {
    details: {
      path: req.originalUrl,
      query: req.query,
      status_code: statusCode,
      method: req.method,
      status: "success",
    },
    valid: true,
    data,
    error: null,
    message,
  };
}

export function sendResponsePaginate(
  req: Request,
  data: any,
  message: string,
  statusCode: number
): ApiResponsePaginate {
  return {
    details: {
      path: req.originalUrl,
      query: req.query,
      status_code: statusCode,
      method: req.method,
      status: "success",
    },
    valid: true,
    data,
    errors: null,
    message,
  };
}

export function errorResponse(
  req: Request,
  message: string,
  statusCode: number,
  statusMsg: string
): ApiResponse {
  return {
    details: {
      path: req.originalUrl,
      query: req.query,
      status_code: statusCode,
      method: req.method,
      status: statusMsg,
    },
    valid: false,
    data: null,
    error: null,
    message: message,
  };
}
