import mongoose from "mongoose";
import { ENV } from "./env";

export class ConnectMongo {
  private _databaseUrl: string;

  constructor() {
    this._databaseUrl = ENV.MONGO_URI;
  }

  async connectDB() {
    try {
      await mongoose.connect(this._databaseUrl);
      console.log("db connected successfully");

      mongoose.connection.on("error", (error) => {
        console.log("MongoDB connection error", error);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
      });
    } catch (error) {
      console.log("Failed to connect mongoDB", error);
    }
  }
}
