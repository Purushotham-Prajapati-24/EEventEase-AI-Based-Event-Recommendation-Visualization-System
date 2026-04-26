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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/notifications", notificationRoutes);

// Basic Route
app.get("/", (req, res) => {
  res.send("EventEase API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
