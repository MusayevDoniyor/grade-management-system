import mongoose from "mongoose";

export default async function connectDB() {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB connection successfully"))
    .catch(() => console.log("❌ MongoDB connection failed"));
}
