import { IItem } from "../../types/item.types";
import { InventoryReportFilter, InventoryReportResult } from "../../types/report.type";

export interface IItemRepository {
  create(item: IItem): Promise<IItem>;
  findAll(): Promise<IItem[]>;
  findById(id: string): Promise<IItem | null>;
  update(id: string, item: Partial<IItem>): Promise<IItem | null>;
  delete(id: string): Promise<IItem | null>;
  search(query: string): Promise<IItem[]>;
  findByName(name: string): Promise<IItem | null>;
  findPaginated(
    search: string | undefined,
    page: number,
    pageSize: number
  ): Promise<{ data: IItem[]; total: number }>;
  getInventoryStats(): Promise<{
    totalItems: number;
    totalInventoryValue: number;
  }>;
  getInventoryReportAggregated(
    page: number,
    pageSize: number,
    filter ?: InventoryReportFilter
  ): Promise<InventoryReportResult>;
}
