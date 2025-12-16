import { SaleReportRowDTO } from "../types/sale.types";

export const SALES_REPORT_COLUMNS = [
  { header: "Date", key: "date", width: 90 },
  { header: "Item", key: "item", width: 160 },
  { header: "Quantity", key: "quantity", width: 80, align: "center" },
  { header: "Total Price", key: "totalPrice", width: 100, align: "right" },
  { header: "Customer", key: "customer", width: 130 },
] satisfies readonly {
  header: string;
  key: keyof SaleReportRowDTO;
  width: number;
  align?: "left" | "center" | "right";
}[];
