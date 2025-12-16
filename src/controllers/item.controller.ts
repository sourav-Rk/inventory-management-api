import { Request, Response } from "express";
import { IItemService } from "../services/interfaces/item.service.interface";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { sendSuccess } from "../utils/response.utils";

export class ItemController {
  private itemService: IItemService;

  constructor(itemService: IItemService) {
    this.itemService = itemService;
  }

  createItem = async (req: Request, res: Response) => {
    const item = await this.itemService.createItem(req.body);
    sendSuccess(res, MESSAGES.ITEM_CREATED, item);
  };

  getAllItems = async (req: Request, res: Response) => {
    const { search, page = "1", pageSize = "10" } = req.query;
    const p = Math.max(1, parseInt(page as string, 10) || 1);
    const ps = Math.max(
      1,
      Math.min(100, parseInt(pageSize as string, 10) || 10)
    );

    const { data, total } = await this.itemService.getAllItems(
      search as string | undefined,
      p,
      ps
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
      meta: {
        page: p,
        pageSize: ps,
        total,
        totalPages: Math.max(1, Math.ceil(total / ps)),
      },
    });
  };

  getItemById = async (req: Request, res: Response) => {
    const item = await this.itemService.getItemById(req.params.id);
    sendSuccess(res, SUCCESS_MESSAGES.DETAILS_FETCHED, item);
  };

  updateItem = async (req: Request, res: Response) => {
    const item = await this.itemService.updateItem(req.params.id, req.body);

    sendSuccess(res, MESSAGES.ITEM_UPDATED, item);
  };

  deleteItem = async (req: Request, res: Response) => {
    await this.itemService.deleteItem(req.params.id);
    sendSuccess(res, MESSAGES.ITEM_DELETED);
  };
}
