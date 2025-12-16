import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middlewares/auth.middleware";
import { container } from "../config/container";


export class ReportRoutes {
  private _reportController;
  public route: Router;

  constructor() {
    this._reportController = container.reportController;
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.route.use(authenticate);

    this.route.get(
      "/dashboard",
      asyncHandler(
        this._reportController.getDashboardStats.bind(this._reportController)
      )
    );

    this.route.get(
      "/sales",
      asyncHandler(
        this._reportController.generateSalesReport.bind(this._reportController)
      )
    );

    this.route.get(
      "/inventory",
      asyncHandler(
        this._reportController.generateInventoryReport.bind(
          this._reportController
        )
      )
    );

    this.route.post(
      "/sales/email",
      asyncHandler(
        this._reportController.sendSalesReportEmail.bind(this._reportController)
      )
    );
  }

  public get routes(): Router {
    return this.route;
  }
}
