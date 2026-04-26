import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "../backend/src/config/db";
import eventRoutes from "../backend/src/routes/eventRoutes";
import userRoutes from "../backend/src/routes/userRoutes";
import recommendationRoutes from "../backend/src/routes/recommendationRoutes";
import authRoutes from "../backend/src/routes/authRoutes";
import notificationRoutes from "../backend/src/routes/notificationRoutes";
import chatRoutes from "../backend/src/routes/chatRoutes";
import imagekitRoutes from "../backend/src/routes/imagekitRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL || "https://your-app.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/imagekit", imagekitRoutes);

app.get("/api", (req, res) => {
  res.send("EventEase API is running...");
});

export default app;
