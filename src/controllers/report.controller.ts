import { Request, Response } from "express";
import { generatePDF } from "../utils/pdfGenerator";
import { generateExcel } from "../utils/excelGenerator";
import PDFDocument from "pdfkit";
import { sendEmail } from "../utils/emailSender";
import { HTTP_STATUS } from "../constants/httpStatus";
import { IReportService } from "../services/interfaces/report.service.interface";
import { ISaleService } from "../services/interfaces/sale.service.interface";
import { sendSuccess } from "../utils/response.utils";
import { SUCCESS_MESSAGES } from "../constants/messages";
import { INVENTORY_REPORT_COLUMNS } from "../config/inventoryReport.config";
import { SALES_REPORT_COLUMNS } from "../config/salesReport.config";
import { IItemService } from "../services/interfaces/item.service.interface";

export class ReportController {
  private saleService: ISaleService;
  private itemService: IItemService;
  private reportService: IReportService;

  constructor(
    saleService: ISaleService,
    itemService: IItemService,
    reportService: IReportService
  ) {
    this.saleService = saleService;
    this.itemService = itemService;
    this.reportService = reportService;
  }

  getDashboardStats = async (req: Request, res: Response) => {
    const stats = await this.reportService.getDashboardStats();
    sendSuccess(res, SUCCESS_MESSAGES.DETAILS_FETCHED, stats);
  };

  generateSalesReport = async (req: Request, res: Response) => {
    const { format, dateFrom, dateTo, page = "1", pageSize = "20" } = req.query;
    const p = Math.max(1, parseInt(page as string, 10) || 1);
    const ps = Math.max(
      1,
      Math.min(200, parseInt(pageSize as string, 10) || 20)
    );

    const fromDt = dateFrom ? new Date(dateFrom as string) : null;
    const toInclusive = dateTo ? new Date(dateTo as string) : null;
    const toExclusive =
      toInclusive !== null
        ? new Date(
            toInclusive.getFullYear(),
            toInclusive.getMonth(),
            toInclusive.getDate() + 1
          )
        : null;

    const sales = await this.saleService.getSalesByDateRange(
      fromDt,
      toExclusive,
      p,
      ps
    );

    const salesSummary = [
      { label: "Total Sales", value: sales.totalSalesCount },
      { label: "Total Revenue", value: `₹ ${sales.totalRevenue.toFixed(2)}` },
      { label: "Average Sale", value: `₹ ${sales.avgSale.toFixed(2)}` },
    ];

    if (format === "pdf") {
      generatePDF(
        res,
        "Sales Report",
        sales.rows,
        SALES_REPORT_COLUMNS,
        salesSummary
      );
    } else if (format === "excel") {
      await generateExcel(
        res,
        "Sales Report",
        sales.rows,
        [
          { header: "Date", key: "date", width: 12, align: "center" },
          { header: "Item", key: "item", width: 22 },
          { header: "Qty", key: "quantity", width: 8, align: "center" },
          { header: "Total", key: "totalPrice", width: 12, align: "right" },
          { header: "Customer", key: "customer", width: 18 },
        ],
        salesSummary
      );
    } else {
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: sales.rows,
        meta: {
          page: p,
          pageSize: ps,
          total: sales.totalSalesCount,
          totalPages: sales.totalPages,
        },
        totals: {
          totalSales: sales.totalSalesCount,
          totalRevenue: sales.totalRevenue,
          avgSale: sales.avgSale,
        },
      });
    }
  };

  sendSalesReportEmail = async (req: Request, res: Response) => {
    const { to, dateFrom, dateTo } = req.body;

    if (!to) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, message: "Recipient email is required" });
    }

    const fromDt = dateFrom ? new Date(dateFrom) : null;
    const toInclusive = dateTo ? new Date(dateTo) : null;
    const toExclusive =
      toInclusive !== null
        ? new Date(
            toInclusive.getFullYear(),
            toInclusive.getMonth(),
            toInclusive.getDate() + 1
          )
        : null;

    const report = await this.saleService.getSalesByDateRange(
      fromDt,
      toExclusive,
      1,
      50000
    );

    const rows = report.rows; 

    const doc = new PDFDocument({ margin: 30 });
    const chunks: Buffer[] = [];

    doc.on("data", (d) => chunks.push(d));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(chunks);

      await sendEmail(
        to,
        "Sales Report",
        "Please find attached the sales report.",
        [
          {
            filename: "sales-report.pdf",
            content: pdfBuffer,
          },
        ]
      );

      res.status(HTTP_STATUS.OK).json({ success: true });
    });

    // ---- PDF CONTENT ----
    doc.fontSize(20).text("Sales Report", { align: "center" });
    doc.moveDown();

    const columns = ["Date", "Item", "Quantity", "TotalPrice", "Customer"];
    const startX = 50;
    let currentY = doc.y;

    columns.forEach((col, i) => {
      doc.fontSize(12).text(col, startX + i * 100, currentY);
    });

    currentY += 20;
    doc.moveTo(startX, currentY).lineTo(550, currentY).stroke();
    currentY += 10;

    rows.forEach((row) => {
      const rowValues = [
        row.date,
        row.item,
        String(row.quantity),
        String(row.totalPrice),
        row.customer,
      ];

      rowValues.forEach((val, i) => {
        doc.fontSize(10).text(String(val), startX + i * 100, currentY);
      });

      currentY += 18;

      if (currentY > doc.page.height - 50) {
        doc.addPage();
        currentY = doc.y;
      }
    });

    doc.end();
  };

  generateInventoryReport = async (req: Request, res: Response) => {
    const {
      format,
      page = "1",
      pageSize = "50",
      range,
      customFrom,
      customTo,
    } = req.query as {
      format?: string;
      page?: string;
      pageSize?: string;
      range?: "today" | "month" | "year" | "custom" | "all";
      customFrom?: string;
      customTo?: string;
    };

    const p = Math.max(1, Number(page));
    const ps = Math.min(200, Math.max(1, Number(pageSize)));

    const now = new Date();

    let from: Date | null = null;
    let to: Date | null = null;

    if (range === "today") {
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      to = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (range === "month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = null;
    } else if (range === "year") {
      from = new Date(now.getFullYear(), 0, 1);
      to = null;
    } else if (range === "custom") {
      from = customFrom ? new Date(customFrom) : null;
      to = customTo ? new Date(customTo) : null;
    }

    const report = await this.itemService.getInventoryReport(p, ps,{from, to});

    const inventorySummary = [
      {
        label: "Total Inventory Value",
        value: `₹ ${report.totals.totalInventoryValue.toFixed(2)}`,
      },
      { label: "Total Sold Quantity", value: report.totals.totalSoldQuantity },
      {
        label: "Total Sold Value",
        value: `₹ ${report.totals.totalSoldValue.toFixed(2)}`,
      },
      { label: "Top Selling Item", value: report.totals.maxSoldItemName },
      { label: "Top Sold Quantity", value: report.totals.maxSoldQuantity },
    ];

    if (format === "pdf") {
      generatePDF(
        res,
        "Inventory Report",
        report.rows,
        INVENTORY_REPORT_COLUMNS,
        inventorySummary
      );
    } else if (format === "excel") {
      await generateExcel(
        res,
        "Inventory Report",
        report.rows,
        INVENTORY_REPORT_COLUMNS,
        inventorySummary
      );
    } else {
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: report.rows,
        meta: {
          page: p,
          pageSize: ps,
          total: report.totalItems,
          totalPages: report.totalPages,
        },
        totals: report.totals,
      });
    }
  };
}
