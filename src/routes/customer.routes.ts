import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middlewares/auth.middleware";
import { container } from "../config/container";
import { validate } from "../middlewares/validate.middleware";
import { createCustomerSchema, updateCustomerSchema } from "../schemas/customer.schema";

 export class CustomerRoutes {
  private _customerController;
  public route: Router;

  constructor() {
    this._customerController = container.customerController;
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.route.use(authenticate);

    this.route.post(
      "/",
      validate(createCustomerSchema),
      asyncHandler(
        this._customerController.createCustomer.bind(this._customerController)
      )
    );

    this.route.get(
      "/",
      asyncHandler(
        this._customerController.getAllCustomers.bind(this._customerController)
      )
    );

    this.route.get(
      "/:id",
      asyncHandler(
        this._customerController.getCustomerById.bind(this._customerController)
      )
    );

    this.route.put(
      "/:id",
      validate(updateCustomerSchema),
      asyncHandler(
        this._customerController.updateCustomer.bind(this._customerController)
      )
    );

    this.route.delete(
      "/:id",
      asyncHandler(
        this._customerController.deleteCustomer.bind(this._customerController)
      )
    );
  }

  public get routes(): Router {
    return this.route;
  }
}
