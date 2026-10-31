import { Response } from "express";
import { StatusCode } from "../constants/statusCodeConstants";
import { IApiErrorResponse, IApiResponse } from "../interfaces/IApiResponse";

export const sendSuccessResponse = <T>(
  res: Response,
  message: string,
  result?: T,
  statusCode: number = StatusCode.OK,
) => {
  const response: IApiResponse<T> = {
    success: true,
    message,
    ...(result !== undefined ? { result } : {}),
  };
  return res.status(statusCode).json(response);
};

export const sendErrorResponse = (
  res: Response,
  message: string,
  statusCode: number,
  errors: Record<string, string> | null=null,
) => {
  const response: IApiErrorResponse = {
    success: false,
    statusCode,
    message,
    errors,
  };
  return res.status(statusCode).json(response);
};
