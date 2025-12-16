import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import { HTTP_STATUS } from "../constants/httpStatus";
import {  SUCCESS_MESSAGES } from "../constants/messages";
import {  sendSuccess } from "../utils/response.utils";
import { ICustomerService } from "../services/interfaces/customer.service";

export class CustomerController {
  private customerService: ICustomerService;

  constructor(customerService: ICustomerService) {
    this.customerService = customerService;
  }

  createCustomer = async (req: Request, res: Response) => {
    const customer = await this.customerService.createCustomer(req.body);
    sendSuccess(res, SUCCESS_MESSAGES.CUSTOMER.CREATED_CUSTOMER, customer);
  };

  getAllCustomers = async (req: Request, res: Response) => {
    const { search, page = "1", pageSize = "10" } = req.query;
    const p = Math.max(1, parseInt(page as string, 10) || 1);
    const ps = Math.max(
      1,
      Math.min(100, parseInt(pageSize as string, 10) || 10)
    );

    const { data, total } = await this.customerService.getAllCustomers(
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

  getCustomerById = async (req: Request, res: Response) => {
    const customer = await this.customerService.getCustomerById(req.params.id);
    sendSuccess(res, SUCCESS_MESSAGES.DETAILS_FETCHED, customer);
  };

  updateCustomer = async (req: Request, res: Response) => {
    const customer = await this.customerService.updateCustomer(
      req.params.id,
      req.body
    );

    sendSuccess(res, SUCCESS_MESSAGES.CUSTOMER.UPDATED_CUSTOMER, customer);
  };

  deleteCustomer = async (req: Request, res: Response) => {
    const customer = await this.customerService.deleteCustomer(req.params.id);
    sendSuccess(res, SUCCESS_MESSAGES.CUSTOMER.DELETED_CUSTOMER);
  };
}
