import express from "express";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/database";
import authRoutes from "./modules/auth/routes/authRoutes";
import userRoutes from "./modules/user/routes/userRoutes";
import friendRoutes from "./modules/friends/routes/friendRequestRoutes";
import gameRequestRoutes from "./modules/gameRequest/routes/gameRequestRoutes";
import cors from "cors";
import { Server } from "socket.io";
import { handleGameSockets } from "./modules/game/  controllers/gameSocketController";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(cors());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/gameRequest", gameRequestRoutes);

handleGameSockets(io);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
