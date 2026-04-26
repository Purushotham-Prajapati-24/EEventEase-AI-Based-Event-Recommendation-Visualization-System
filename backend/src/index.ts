import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db";
import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";
import authRoutes from "./routes/authRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import chatRoutes from "./routes/chatRoutes";

import { createServer } from "http";
import { initSocket } from "./socket";

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect to Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chats", chatRoutes);

// Basic Route
app.get("/", (req, res) => {
  res.send("EventEase API is running...");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
