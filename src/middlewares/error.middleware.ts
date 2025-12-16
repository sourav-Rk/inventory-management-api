import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { sendError } from "../utils/response.utils";

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", err);

  // Handle AppError (operational errors)
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    sendError(res, err.message, 400);
    return;
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === "CastError") {
    sendError(res, "Invalid ID format", 400);
    return;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    sendError(res, "Invalid token", 401);
    return;
  }

  if (err.name === "TokenExpiredError") {
    sendError(res, "Token expired", 401);
    return;
  }

  // Handle duplicate key errors
  if ((err as NodeJS.ErrnoException).code === "ECONNREFUSED") {
    sendError(res, "Database connection failed", 500);
    return;
  }

  // Default error response
  sendError(res, "Internal server error", 500);
};
