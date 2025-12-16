import { IItem } from "../../types/item.types";
import { InventoryReportFilter, InventoryReportResult } from "../../types/report.type";

export interface IItemService {
  createItem(item: IItem): Promise<IItem>;
  getAllItems(
    search?: string,
    page?: number,
    pageSize?: number
  ): Promise<{ data: IItem[]; total: number }>;
  getItemById(id: string): Promise<IItem | null>;
  updateItem(id: string, item: Partial<IItem>): Promise<IItem | null>;
  deleteItem(id: string): Promise<IItem | null>;
  searchItems(query: string): Promise<IItem[]>;
  getInventoryReport(
    page: number,
    pageSize: number,
    filter ?: InventoryReportFilter
  ): Promise<InventoryReportResult>;
}
