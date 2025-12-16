import { Request, Response } from "express";
import { ISaleService } from "../services/interfaces/sale.service.interface";
import { HTTP_STATUS } from "../constants/httpStatus";
import { SUCCESS_MESSAGES } from "../constants/messages";
import { sendSuccess } from "../utils/response.utils";

export class SaleController {
  private saleService: ISaleService;

  constructor(saleService: ISaleService) {
    this.saleService = saleService;
  }

  createSale = async (req: Request, res: Response) => {
    const sale = await this.saleService.createSale(req.body);
    sendSuccess(res, SUCCESS_MESSAGES.SALES.CREATED_SUCCESSFULLY, sale);
  };

  getAllSales = async (req: Request, res: Response) => {
    const { page = "1", pageSize = "20" } = req.query;
    const p = Math.max(1, parseInt(page as string, 10) || 1);
    const ps = Math.max(
      1,
      Math.min(200, parseInt(pageSize as string, 10) || 20)
    );
    const { data, total } = await this.saleService.getAllSales(p, ps);
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

  getCustomerLedger = async (req: Request, res: Response) => {
    const sales = await this.saleService.getCustomerLedger(
      req.params.customerId
    );
    sendSuccess(res, SUCCESS_MESSAGES.DETAILS_FETCHED, sales);
  };
}
