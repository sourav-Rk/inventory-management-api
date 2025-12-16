import mongoose, { Schema, Document } from "mongoose";
import { ISale } from "../types/sale.types";

const SaleSchema: Schema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    customerName: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const SaleModel = mongoose.model<ISale & Document>("Sale", SaleSchema);
