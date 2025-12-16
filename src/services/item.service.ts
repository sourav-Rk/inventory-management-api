import { IItemRepository } from "../repositories/interfaces/item.repository.interface";
import { IItemService } from "./interfaces/item.service.interface";
import { IItem } from "../types/item.types";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import {
  InventoryReportFilter,
  InventoryReportResult,
} from "../types/report.type";

export class ItemService implements IItemService {
  private itemRepository: IItemRepository;

  constructor(itemRepository: IItemRepository) {
    this.itemRepository = itemRepository;
  }

  async createItem(item: IItem): Promise<IItem> {
    const existing = await this.itemRepository.findByName(item.name);
    if (existing) {
      throw new AppError(
        MESSAGES.ITEMS.DUPLICATE_NAME,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    return this.itemRepository.create(item);
  }

  async getAllItems(
    search?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ data: IItem[]; total: number }> {
    return this.itemRepository.findPaginated(search, page, pageSize);
  }

  async getItemById(id: string): Promise<IItem | null> {
    const existingItem = await this.itemRepository.findById(id);
    if (!existingItem) {
      throw new AppError(MESSAGES.ITEMS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    return existingItem;
  }

  async updateItem(id: string, item: Partial<IItem>): Promise<IItem | null> {
    const existingItem = await this.itemRepository.findById(id);
    if (!existingItem) {
      throw new AppError(MESSAGES.ITEMS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (item.name) {
      const existing = await this.itemRepository.findByName(item.name);
      if (existing && existing._id?.toString() !== id) {
        throw new AppError(
          MESSAGES.ITEMS.DUPLICATE_NAME,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }
    return this.itemRepository.update(id, item);
  }

  async deleteItem(id: string): Promise<IItem | null> {
    const existingItem = await this.itemRepository.findById(id);
    if (!existingItem) {
      throw new AppError(MESSAGES.ITEMS.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    return this.itemRepository.delete(id);
  }

  async searchItems(query: string): Promise<IItem[]> {
    return this.itemRepository.search(query);
  }

  async getInventoryReport(
    page: number = 1,
    pageSize: number = 50,
    filter?: InventoryReportFilter
  ): Promise<InventoryReportResult> {
    return this.itemRepository.getInventoryReportAggregated(page, pageSize,filter);
  }
}
