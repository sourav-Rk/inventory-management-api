import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { container } from "../config/container";
import { asyncHandler } from "../utils/asyncHandler";

export class AuthRoutes {
  private _authController;
  public route: Router;

  constructor() {
    this._authController = container.authController;
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.route.post(
      "/register",
      validate(registerSchema),
      asyncHandler(this._authController.register.bind(this._authController))
    );

    this.route.post(
      "/login",
      validate(loginSchema),
      asyncHandler(this._authController.login.bind(this._authController))
    );

    this.route.post(
      "/refresh-token",
      asyncHandler(this._authController.refreshToken.bind(this._authController))
    );
  }

   public get routes(): Router {
    return this.route;
  }
}

