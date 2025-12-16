import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middlewares/auth.middleware";
import { container } from "../config/container";
import { validate } from "../middlewares/validate.middleware";
import { createItemSchema, updateItemSchema } from "../schemas/item.schema";

export class ItemRoutes {
  private _itemController;
  public route: Router;

  constructor() {
    this._itemController = container.itemController;
    this.route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.route.use(authenticate);

    this.route.post(
      "/",
      validate(createItemSchema),
      asyncHandler(this._itemController.createItem.bind(this._itemController))
    );

    this.route.get(
      "/",
      asyncHandler(this._itemController.getAllItems.bind(this._itemController))
    );

    this.route.get(
      "/:id",
      asyncHandler(this._itemController.getItemById.bind(this._itemController))
    );

    this.route.put(
      "/:id",
      validate(updateItemSchema),
      asyncHandler(this._itemController.updateItem.bind(this._itemController))
    );

    this.route.delete(
      "/:id",
      asyncHandler(this._itemController.deleteItem.bind(this._itemController))
    );
  }

  public get routes(): Router {
    return this.route;
  }
}
