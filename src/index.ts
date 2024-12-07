import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./modules/auth/routes/authRoutes";
import userRoutes from "./modules/user/routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
