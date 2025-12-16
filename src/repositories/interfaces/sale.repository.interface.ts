import { ISale } from "../../types/sale.types";

export interface ISaleRepository {
  create(sale: ISale): Promise<ISale>;
  findAll(): Promise<ISale[]>;
  findByCustomer(customerId: string): Promise<ISale[]>;
  findById(id: string): Promise<ISale | null>;
  findPaginated(
    page: number,
    pageSize: number
  ): Promise<{ data: ISale[]; total: number }>;
  findByDateRangePaginated(
    from?: Date | null,
    to?: Date | null,
    page?: number,
    pageSize?: number
  ): Promise<{ data: ISale[]; total: number }>;
  getSalesStats(): Promise<{
    totalSales: number;
    totalSalesValue: number;
  }>;

  getSalesReportAggregated(
    from?: Date | null,
    to?: Date | null,
    page: number,
    pageSize: number
  ): Promise<{
    rows: any[];
    totalSalesCount: number;
    totalRevenue: number;
    avgSale: number;
    totalPages: number;
  }>;
}
