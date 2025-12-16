import mongoose, { Schema, Document } from "mongoose";
import { ICustomer } from "../types/customer.types";

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  { timestamps: true }
);

CustomerSchema.index({ name: "text", mobile: "text" });

export const CustomerModel = mongoose.model<ICustomer & Document>("Customer", CustomerSchema);
