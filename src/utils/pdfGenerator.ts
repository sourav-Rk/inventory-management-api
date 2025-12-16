import PDFDocument from "pdfkit";
import { Response } from "express";

interface PDFColumn<T> {
  header: string;
  key: keyof T;
  width: number;
  align?: "left" | "center" | "right";
}
interface PDFSummaryItem {
  label: string;
  value: string | number;
}

/* ---------- HELPERS ---------- */

const getTotalWidth = <T>(columns: PDFColumn<T>[]): number =>
  columns.reduce((sum, c) => sum + c.width, 0);

const drawRowBorder = <T>(
  doc: typeof PDFDocument,
  startX: number,
  y: number,
  columns: PDFColumn<T>[],
  height: number
) => {
  let x = startX;
  columns.forEach((col) => {
    doc.rect(x, y, col.width, height).stroke("#cbd5e1");
    x += col.width;
  });
};

export const generatePDF = <T extends object>(
  res: Response,
  title: string,
  data: T[],
  columns: PDFColumn<T>[],
  summary?: PDFSummaryItem[]
) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${title.replace(/\s+/g, "_")}.pdf`
  );

  doc.pipe(res);

  /* ---------- TITLE ---------- */
  doc.font("Helvetica-Bold").fontSize(18).text(title, { align: "center" });

  doc.moveDown(1.5);

  /* ---------- TABLE METRICS ---------- */
  const usablePageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const tableWidth = getTotalWidth(columns);

  // 👉 Center table horizontally
  const startX = doc.page.margins.left + (usablePageWidth - tableWidth) / 2;

  const rowHeight = 22;
  const headerHeight = 30;

  let y = doc.y;

  /* ---------- HEADER ---------- */
  doc.rect(startX, y, tableWidth, headerHeight).fill("#f1f5f9");

  doc.fillColor("#000").font("Helvetica-Bold").fontSize(11);

  let x = startX;
  columns.forEach((col) => {
    doc.text(col.header, x + 6, y + 9, {
      width: col.width - 12,
      align: col.align ?? "left",
      ellipsis: true,
      lineBreak: false,
    });
    x += col.width;
  });

  drawRowBorder(doc, startX, y, columns, headerHeight);
  y += headerHeight;

  /* ---------- ROWS ---------- */
  doc.font("Helvetica").fontSize(10);

  data.forEach((row) => {
    // Page break
    if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      y = doc.page.margins.top;
    }

    x = startX;

    columns.forEach((col) => {
      const value = row[col.key] ?? "";
      doc.text(String(value), x + 6, y + 6, {
        width: col.width - 12,
        height: rowHeight - 12,
        align: col.align ?? "left",
        ellipsis: true,
      });

      x += col.width;
    });

    drawRowBorder(doc, startX, y, columns, rowHeight);
    y += rowHeight;
  });

  /* ---------- SUMMARY SECTION ---------- */
  if (summary && summary.length > 0) {
    doc.moveDown(2);

    doc.font("Helvetica-Bold").fontSize(16).text("Summary", startX, doc.y);
    doc.moveDown(1);

    const summaryRowHeight = 22;
    const labelWidth = tableWidth * 0.7;
    const valueWidth = tableWidth * 0.3;

    let sy = doc.y;

    summary.forEach((item) => {
      // Background
      doc.rect(startX, sy, tableWidth, summaryRowHeight).fill("#f8fafc");

      // Label
      doc
        .fillColor("#000")
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(item.label, startX + 6, sy + 6, {
          width: labelWidth - 12,
          align: "left",
        });

      // Value
      doc
        .font("Helvetica")
        .text(String(item.value), startX + labelWidth, sy + 6, {
          width: valueWidth - 12,
          align: "right",
        });

      // Border
      doc.rect(startX, sy, tableWidth, summaryRowHeight).stroke("#cbd5e1");

      sy += summaryRowHeight;
    });

    doc.moveDown(2);
  }

  doc.end();
};
