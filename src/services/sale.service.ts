import { ISaleRepository } from "../repositories/interfaces/sale.repository.interface";
import { IItemRepository } from "../repositories/interfaces/item.repository.interface";
import { ISale, SaleReportRowDTO } from "../types/sale.types";
import { MESSAGES } from "../constants/messages";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { ICustomerRepository } from "../repositories/interfaces/customer.repository.interface";
import { ISaleService } from "./interfaces/sale.service.interface";

export class SaleService implements ISaleService {
  private saleRepository: ISaleRepository;
  private itemRepository: IItemRepository;
  private customerRepository: ICustomerRepository;

  constructor(
    saleRepository: ISaleRepository,
    itemRepository: IItemRepository,
    customerRepository: ICustomerRepository
  ) {
    this.saleRepository = saleRepository;
    this.itemRepository = itemRepository;
    this.customerRepository = customerRepository;
  }

  async createSale(saleData: ISale): Promise<ISale> {
    /**
     *Check Item Existence and Stock
     */
    const item = await this.itemRepository.findById(saleData.item);
    if (!item) {
      throw new AppError(MESSAGES.ITEMS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    if (item.quantity < saleData.quantity) {
      throw new AppError(
        MESSAGES.ITEMS.INSUFFICIENT_QUANTITY,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const updatedItem = await this.itemRepository.update(item._id!, {
      quantity: item.quantity - saleData.quantity,
    });

    if (!updatedItem) {
      throw new Error(MESSAGES.ITEMS.FAILED_TO_UPDATE_STOCK);
    }

    /**
     *Calculate Price (if not provided or to verify)
     */
    const totalPrice = item.price * saleData.quantity;

    /**
     *Create Sale Record
     */
    const sale = await this.saleRepository.create({
      ...saleData,
      totalPrice,
    });

    return sale;
  }

  async getAllSales(
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ data: ISale[]; total: number }> {
    return await this.saleRepository.findPaginated(page, pageSize);
  }

  async getSalesByDateRange(
    page: number,
    pageSize: number,
    from?: Date | null,
    to?: Date | null
  ): Promise<{
    rows: SaleReportRowDTO[];
    totalSalesCount: number;
    totalRevenue: number;
    avgSale: number;
    totalPages: number;
  }> {
    const data = await this.saleRepository.getSalesReportAggregated(
      from,
      to,
      page as number,
      pageSize as number
    );

    return data;
  }

  async getCustomerLedger(customerId: string): Promise<ISale[]> {
    const isCustomerExist = await this.customerRepository.findById(customerId);

    if (!isCustomerExist) {
      throw new AppError(
        MESSAGES.AUTHENTICATION.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return await this.saleRepository.findByCustomer(customerId);
  }
}
