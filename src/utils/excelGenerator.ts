import ExcelJS from "exceljs";
import { Response } from "express";

interface ExcelColumn<T> {
  header: string;
  key: keyof T;
  width?: number;
  align?: "left" | "center" | "right";
}

interface ExcelSummaryItem {
  label: string;
  value: string | number;
}

export const generateExcel = async <T extends object>(
  res: Response,
  title: string,
  data: T[],
  columns: ExcelColumn<T>[],
  summary?: ExcelSummaryItem[]
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report", {
    properties: { defaultRowHeight: 22 },
  });

  let currentRow = 1;
  /* ---------- SUMMARY ---------- */
  if (summary && summary.length > 0) {
    worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
    const titleRow = worksheet.getRow(currentRow);
    titleRow.getCell(1).value = "SALES SUMMARY";
    titleRow.font = { bold: true };
    titleRow.alignment = { horizontal: "center", vertical: "middle" };
    titleRow.height = 26;

    currentRow++;

    summary.forEach((item) => {
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      worksheet.mergeCells(`D${currentRow}:E${currentRow}`);

      worksheet.getCell(`A${currentRow}`).value = item.label;
      worksheet.getCell(`D${currentRow}`).value = item.value;

      worksheet.getCell(`A${currentRow}`).font = { bold: true };
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: "left" };
      worksheet.getCell(`D${currentRow}`).alignment = { horizontal: "right" };

      currentRow++;
    });

    currentRow += 2; // space before table
  }

  /* ---------- COLUMNS ---------- */
  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key as string,
    width: col.width ?? 13,
    style: {
      alignment: {
        vertical: "middle",
        horizontal: col.align ?? "left",
      },
    },
  }));

  /* ---------- HEADER ---------- */
  const headerRowIndex = currentRow;
  const headerRow = worksheet.getRow(headerRowIndex);

  headerRow.values = columns.map((c) => c.header);
  headerRow.height = 26;

  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF1F5F9" },
    };
    cell.border = getBorder();
  });

  currentRow++;

  /* ---------- DATA ROWS ---------- */
  data.forEach((rowData) => {
    const excelRow = worksheet.insertRow(currentRow, rowData);

    excelRow.eachCell((cell) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: cell.alignment?.horizontal ?? "left",
        wrapText: true,
      };
      cell.border = getBorder();
    });

    currentRow++;
  });

  /* ---------- FREEZE HEADER ---------- */
  worksheet.views = [{ state: "frozen", ySplit: headerRowIndex }];

  /* ---------- RESPONSE ---------- */
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${title.replace(/\s+/g, "_")}.xlsx`
  );

  await workbook.xlsx.write(res);
  res.end();
};

const getBorder = (): ExcelJS.Borders => ({
  top: { style: "thin", color: { argb: "FFCBD5E1" } },
  left: { style: "thin", color: { argb: "FFCBD5E1" } },
  bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
  right: { style: "thin", color: { argb: "FFCBD5E1" } },
  diagonal: {},
});
