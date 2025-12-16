import { SaleModel } from "../models/sale.model";
import { ISaleRepository } from "./interfaces/sale.repository.interface";
import { ISale } from "../types/sale.types";

export class SaleRepository implements ISaleRepository {
  async create(sale: ISale): Promise<ISale> {
    const newSale = await SaleModel.create(sale);
    return newSale.toObject();
  }

  async findAll(): Promise<ISale[]> {
    return SaleModel.find()
      .populate("item")
      .populate("customer")
      .sort({ date: -1 });
  }

  async findPaginated(
    page: number,
    pageSize: number
  ): Promise<{ data: ISale[]; total: number }> {
    const total = await SaleModel.countDocuments();
    const data = await SaleModel.find()
      .populate("item")
      .populate("customer")
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return { data, total };
  }

  async findByDateRangePaginated(
    from?: Date | null,
    to?: Date | null,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ data: ISale[]; total: number }> {
    const filter: Record<string, unknown> = {};
    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) {
        dateFilter.$gte = from;
      }
      if (to) {
        dateFilter.$lt = to;
      }
      filter.date = dateFilter;
    }

    const total = await SaleModel.countDocuments(filter);
    const data = await SaleModel.find(filter)
      .populate("item")
      .populate("customer")
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return { data, total };
  }

  async findByCustomer(customerId: string): Promise<ISale[]> {
    return SaleModel.find({ customer: customerId })
      .populate("item")
      .sort({ date: -1 });
  }

  async findById(id: string): Promise<ISale | null> {
    return SaleModel.findById(id).populate("item").populate("customer");
  }

  async getSalesStats(): Promise<{
    totalSales: number;
    totalSalesValue: number;
  }> {
    const result = await SaleModel.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalSalesValue: { $sum: "$totalPrice" },
        },
      },
    ]);

    return result[0] || { totalSales: 0, totalSalesValue: 0 };
  }

  async getSalesReportAggregated(
  from?: Date | null,
  to?: Date | null,
  page: number = 1,
  pageSize: number = 20
): Promise<{
  rows: any[];
  totalSalesCount: number;
  totalRevenue: number;
  avgSale: number;
  totalPages: number;
}> {
  const match: any = {};
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = from;
    if (to) match.date.$lt = to;
  }

  const skip = (page - 1) * pageSize;

  const result = await SaleModel.aggregate([
    { $match: match },

    {
      $lookup: {
        from: "items",
        localField: "item",
        foreignField: "_id",
        as: "item",
      },
    },
    { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },

    {
      $facet: {
        rows: [
          { $sort: { date: -1 } },
          { $skip: skip },
          { $limit: pageSize },
          {
            $project: {
              _id: 0,
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$date" },
              },
              item: { $ifNull: ["$item.name", "Unknown Item"] },
              quantity: 1,
              totalPrice: 1,
              customer: {
                $ifNull: ["$customer.name", { $ifNull: ["$customerName", "Cash"] }],
              },
            },
          },
        ],

        totals: [
          {
            $group: {
              _id: null,
              totalSalesCount: { $sum: 1 },
              totalRevenue: { $sum: "$totalPrice" },
            },
          },
        ],
      },
    },
  ]);

  const rows = result[0]?.rows ?? [];
  const totals = result[0]?.totals?.[0] ?? {
    totalSalesCount: 0,
    totalRevenue: 0,
  };

  return {
    rows,
    totalSalesCount: totals.totalSalesCount,
    totalRevenue: totals.totalRevenue,
    avgSale:
      totals.totalSalesCount > 0
        ? totals.totalRevenue / totals.totalSalesCount
        : 0,
    totalPages: Math.max(
      1,
      Math.ceil(totals.totalSalesCount / pageSize)
    ),
  };
}

}
