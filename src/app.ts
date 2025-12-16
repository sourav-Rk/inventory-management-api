import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware";
import { container } from "./config/container";

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.setMiddleware();
    this.setRoutes();
  }

  private setRoutes() {
    this.app.use("/api/auth", container.authRouter.routes);
    this.app.use("/api/items", container.itemRouter.routes);
    this.app.use("/api/customers", container.customerRouter.routes);
    this.app.use("/api/sales", container.salesRouter.routes);
    this.app.use("/api/reports", container.reportRouter.routes);
    
    this.app.use(errorHandler);
  }

  private setMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan("dev"));
  }

  public getApp() {
    return this.app;
  }
}
