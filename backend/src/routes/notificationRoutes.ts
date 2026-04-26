import express from "express";
import { getNotifications, createInvite, markAsRead } from "../controllers/notificationController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getNotifications);
router.post("/invite", protect, createInvite);
router.patch("/:id/read", protect, markAsRead);

export default router;
