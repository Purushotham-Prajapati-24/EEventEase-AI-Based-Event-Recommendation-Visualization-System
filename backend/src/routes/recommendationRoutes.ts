import express from "express";
import { getPersonalizedRecommendations } from "../controllers/recommendationController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:userId", protect, getPersonalizedRecommendations);

export default router;
