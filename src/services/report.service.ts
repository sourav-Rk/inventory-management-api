import { ICustomerRepository } from "../repositories/interfaces/customer.repository.interface";
import { IItemRepository } from "../repositories/interfaces/item.repository.interface";
import { ISaleRepository } from "../repositories/interfaces/sale.repository.interface";
import { IReportService } from "./interfaces/report.service.interface";

export class ReportService implements IReportService {
  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly saleRepository: ISaleRepository,
    private readonly customerRepository : ICustomerRepository
  ) {}

  async getDashboardStats(): Promise<{
    totalItems: number;
    totalInventoryValue: number;
    totalSales: number;
    totalSalesValue: number;
    totalCustomers : number;
  }> {
    const [itemStats, saleStats,totalCustomers] = await Promise.all([
      this.itemRepository.getInventoryStats(),
      this.saleRepository.getSalesStats(),
      this.customerRepository.totalCustomers()
    ]);

    return {
      totalItems: itemStats.totalItems,
      totalInventoryValue: itemStats.totalInventoryValue,
      totalSales: saleStats.totalSales,
      totalSalesValue: saleStats.totalSalesValue,
      totalCustomers : totalCustomers
    };
  }
}
