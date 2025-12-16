export interface InventoryReportRowDTO {
  name: string;
  quantity: number;
  price: number;
  description?: string;
  soldQuantity: number;
  soldValue: number;
}

export interface InventoryReportResult {
  rows: InventoryReportRowDTO[];
  totalItems: number;
  totalPages: number;

  totals: {
    totalInventoryValue: number;
    totalSoldQuantity: number;
    totalSoldValue: number;
    maxSoldItemName: string;
    maxSoldQuantity: number;
  };
}


export interface InventoryReportFilter {
  from?: Date | null;
  to?: Date | null;
}
