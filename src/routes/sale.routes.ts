import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middlewares/auth.middleware";
import { container } from "../config/container";

export class SaleRoutes {
  private _saleController;
  public route: Router;

  constructor() {
    this._saleController = container.saleController;
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.route.use(authenticate);

    this.route.post(
      "/",
      asyncHandler(this._saleController.createSale.bind(this._saleController))
    );

    this.route.get(
      "/",
      asyncHandler(this._saleController.getAllSales.bind(this._saleController))
    );

    this.route.get(
      "/customer/:customerId",
      asyncHandler(
        this._saleController.getCustomerLedger.bind(this._saleController)
      )
    );
  }

  public get routes(): Router {
    return this.route;
  }
}
