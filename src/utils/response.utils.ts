import { Response } from "express";
import { ApiResponse, PaginatedResponse } from "../types/common.types";

/**
 * Sends a success response
 */
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
};

/**
 * Sends a created response (201)
 */
export const sendCreated = <T>(
  res: Response,
  message: string,
  data?: T
): Response => {
  return sendSuccess(res, message, data, 201);
};

/**
 * Sends an error response
 */
export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    error,
  };
  return res.status(statusCode).json(response);
};

/**
 * Sends a paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination,
  };
  return res.status(200).json(response);
};
