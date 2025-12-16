import mongoose, { Schema, Document } from "mongoose";
import { IItem } from "../types/item.types";

const ItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

ItemSchema.index({ name: "text", description: "text" });

export const ItemModel = mongoose.model<IItem & Document>("Item", ItemSchema);
