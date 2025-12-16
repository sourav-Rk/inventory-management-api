import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      console.log("Validation Error:", JSON.stringify(error, null, 2)); // Debug logging
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.issues?.map((err) => ({
          field: err.path[1] || err.path[0], // Handle root errors too
          message: err.message,
        })) || [],
      });
    }
    next(error);
  }
};
