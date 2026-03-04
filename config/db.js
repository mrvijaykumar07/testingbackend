import mongoose from "mongoose";
import config from "./env.js";

/**
 * Establishes a MongoDB connection.
 * Terminates the application if the connection fails.
 */
export const connectDB = async () => {
  try {
    if (!config.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in the environment configuration.");
    }

    await mongoose.connect(config.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};