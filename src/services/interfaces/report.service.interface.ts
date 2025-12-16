export interface IReportService {
  getDashboardStats(): Promise<{
    totalItems: number;
    totalInventoryValue: number;
    totalSales: number;
    totalSalesValue: number;
  }>;
}
