import { InventoryReportRowDTO } from "../types/report.type";

export const INVENTORY_REPORT_COLUMNS = [
  { header: "Name", key: "name", width: 120 },
  { header: "Qty", key: "quantity", width: 50, align: "center" },
  { header: "Price", key: "price", width: 70, align: "right" },
  { header: "Description", key: "description", width: 140 },
  { header: "Sold Qty", key: "soldQuantity", width: 60, align: "center" },
  { header: "Sold Value", key: "soldValue", width: 75, align: "right" },
] satisfies readonly {
  header: string;
  key: keyof InventoryReportRowDTO;
  width: number;
  align?: "left" | "center" | "right";
}[];
