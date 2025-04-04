import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import app from "./middleware/app.js";

connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
);
