import express from "express";
import imagekit from "../config/imagekit";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/auth", protect, (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

export default router;
