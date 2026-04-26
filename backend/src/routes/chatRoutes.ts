import express from "express";
import { accessChat, fetchChats, fetchMessages, getChatById } from "../controllers/chatController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.get("/:chatId", protect, getChatById);
router.get("/:chatId/messages", protect, fetchMessages);

export default router;
