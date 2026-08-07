import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectDatabase() {
  const { MONGO_URI } = config;

  if (!MONGO_URI) {
    throw new Error("MONGODB_URI environment variable is required.");
  }

  await mongoose.connect(MONGO_URI);
  console.info("Connected to MongoDB.");
}
