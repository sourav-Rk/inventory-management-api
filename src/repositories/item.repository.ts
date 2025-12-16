import { ItemModel } from "../models/item.model";
import { IItemRepository } from "./interfaces/item.repository.interface";
import { IItem } from "../types/item.types";
import {
  InventoryReportFilter,
  InventoryReportResult,
  InventoryReportRowDTO,
} from "../types/report.type";

export class ItemRepository implements IItemRepository {
  async create(item: IItem): Promise<IItem> {
    const newItem = await ItemModel.create(item);
    return newItem.toObject();
  }

  async findAll(): Promise<IItem[]> {
    return ItemModel.find().sort({ createdAt: -1 });
  }

  async findPaginated(
    search: string | undefined,
    page: number,
    pageSize: number
  ): Promise<{ data: IItem[]; total: number }> {
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await ItemModel.countDocuments(filter);
    const data = await ItemModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return { data, total };
  }

  async findById(id: string): Promise<IItem | null> {
    return ItemModel.findById(id);
  }

  async update(id: string, item: Partial<IItem>): Promise<IItem | null> {
    return ItemModel.findByIdAndUpdate(id, item, { new: true });
  }

  async delete(id: string): Promise<IItem | null> {
    return ItemModel.findByIdAndDelete(id);
  }

  async search(query: string): Promise<IItem[]> {
    // Using Regex for partial match on name or description
    return ItemModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
  }

  async findByName(name: string): Promise<IItem | null> {
    return ItemModel.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
  }

  async getInventoryStats(): Promise<{
    totalItems: number;
    totalInventoryValue: number;
  }> {
    const result = await ItemModel.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalInventoryValue: {
            $sum: { $multiply: ["$price", "$quantity"] },
          },
        },
      },
    ]);

    return result[0] || { totalItems: 0, totalInventoryValue: 0 };
  }

  // async getInventoryReportAggregated(
  //   page: number = 1,
  //   pageSize: number = 50,
  //   filter ?: InventoryReportFilter
  // ): Promise<InventoryReportResult> {
  //   const skip = (page - 1) * pageSize;

  //   const result = await ItemModel.aggregate([
  //     {
  //       $lookup: {
  //         from: "sales",
  //         localField: "_id",
  //         foreignField: "item",
  //         as: "sales",
  //       },
  //     },
  //     {
  //       $addFields: {
  //         soldQuantity: { $sum: "$sales.quantity" },
  //         soldValue: { $sum: "$sales.totalPrice" },
  //       },
  //     },
  //     {
  //       $facet: {
  //         rows: [
  //           { $sort: { createdAt: -1 } },
  //           { $skip: skip },
  //           { $limit: pageSize },
  //           {
  //             $project: {
  //               _id: 0,
  //               name: 1,
  //               quantity: 1,
  //               price: 1,
  //               description: 1,
  //               soldQuantity: 1,
  //               soldValue: 1,
  //             },
  //           },
  //         ],

  //         totals: [
  //           {
  //             $group: {
  //               _id: null,
  //               totalItems: { $sum: 1 },
  //               totalInventoryValue: {
  //                 $sum: { $multiply: ["$price", "$quantity"] },
  //               },
  //               totalSoldQuantity: { $sum: "$soldQuantity" },
  //               totalSoldValue: { $sum: "$soldValue" },
  //               maxSoldQuantity: { $max: "$soldQuantity" },
  //             },
  //           },
  //         ],

  //         maxSoldItem: [
  //           { $sort: { soldQuantity: -1 } },
  //           { $limit: 1 },
  //           { $project: { name: 1, soldQuantity: 1 } },
  //         ],
  //       },
  //     },
  //   ]);

  //   const rows: InventoryReportRowDTO[] = result[0]?.rows ?? [];
  //   const totalsAgg = result[0]?.totals?.[0];
  //   const maxSold = result[0]?.maxSoldItem?.[0];

  //   return {
  //     rows,
  //     totalItems: totalsAgg?.totalItems ?? 0,
  //     totalPages: Math.max(
  //       1,
  //       Math.ceil((totalsAgg?.totalItems ?? 0) / pageSize)
  //     ),
  //     totals: {
  //       totalInventoryValue: totalsAgg?.totalInventoryValue ?? 0,
  //       totalSoldQuantity: totalsAgg?.totalSoldQuantity ?? 0,
  //       totalSoldValue: totalsAgg?.totalSoldValue ?? 0,
  //       maxSoldItemName: maxSold?.name ?? "",
  //       maxSoldQuantity: maxSold?.soldQuantity ?? 0,
  //     },
  //   };
  // }

  async getInventoryReportAggregated(
  page: number = 1,
  pageSize: number = 50,
  filter?: InventoryReportFilter
): Promise<InventoryReportResult> {

  const skip = (page - 1) * pageSize;

  const salesDateMatch: Record<string, any> = {};
  if (filter?.from || filter?.to) {
    salesDateMatch.date = {};
    if (filter.from) salesDateMatch.date.$gte = filter.from;
    if (filter.to) salesDateMatch.date.$lt = filter.to;
  }

  const result = await ItemModel.aggregate([
    {
      $lookup: {
        from: "sales",
        let: { itemId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$item", "$$itemId"] }
            }
          },
          ...(Object.keys(salesDateMatch).length
            ? [{ $match: salesDateMatch }]
            : [])
        ],
        as: "sales",
      },
    },
    {
      $addFields: {
        soldQuantity: { $sum: "$sales.quantity" },
        soldValue: { $sum: "$sales.totalPrice" },
      },
    },
    {
      $facet: {
        rows: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: pageSize },
          {
            $project: {
              _id: 0,
              name: 1,
              description: 1,
              quantity: 1,
              price: 1,
              soldQuantity: 1,
              soldValue: 1,
            },
          },
        ],

        totals: [
          {
            $group: {
              _id: null,
              totalItems: { $sum: 1 },
              totalInventoryValue: {
                $sum: { $multiply: ["$price", "$quantity"] },
              },
              totalSoldQuantity: { $sum: "$soldQuantity" },
              totalSoldValue: { $sum: "$soldValue" },
              maxSoldQuantity: { $max: "$soldQuantity" },
            },
          },
        ],

        maxSoldItem: [
          { $sort: { soldQuantity: -1 } },
          { $limit: 1 },
          { $project: { name: 1, soldQuantity: 1 } },
        ],
      },
    },
  ]);

  const rows = result[0]?.rows ?? [];
  const totalsAgg = result[0]?.totals?.[0];
  const maxSold = result[0]?.maxSoldItem?.[0];

  return {
    rows,
    totalItems: totalsAgg?.totalItems ?? 0,
    totalPages: Math.max(
      1,
      Math.ceil((totalsAgg?.totalItems ?? 0) / pageSize)
    ),
    totals: {
      totalInventoryValue: totalsAgg?.totalInventoryValue ?? 0,
      totalSoldQuantity: totalsAgg?.totalSoldQuantity ?? 0,
      totalSoldValue: totalsAgg?.totalSoldValue ?? 0,
      maxSoldItemName: maxSold?.name ?? "",
      maxSoldQuantity: maxSold?.soldQuantity ?? 0,
    },
  };
}

}
