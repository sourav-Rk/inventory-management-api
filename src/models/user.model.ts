import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/user.types";

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: false },
    password: { type: String, required: true, select: false },
    role: { type: String, default: "staff" },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser & Document>("User", UserSchema);
