import { ISale, SaleReportRowDTO } from "../../types/sale.types";

export interface ISaleService {
  createSale(saleData: ISale): Promise<ISale>;
  getAllSales(
    page?: number,
    pageSize?: number
  ): Promise<{ data: ISale[]; total: number }>;
  getSalesByDateRange(
    from?: Date | null,
    to?: Date | null,
    page?: number,
    pageSize?: number
  ): Promise<{
    rows: SaleReportRowDTO[];
    totalSalesCount: number;
    totalRevenue: number;
    avgSale: number;
    totalPages: number;
  }>;
  getCustomerLedger(customerId: string): Promise<ISale[]>;
}
