import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./modules/auth/routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
