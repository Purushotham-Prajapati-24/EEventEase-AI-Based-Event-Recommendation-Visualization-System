import express from "express";
import { getUsers, getUserById, createUser, updateProfile, followUser, unfollowUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);

// Social & Profile Routes
router.put("/:id", protect, updateProfile);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

export default router;
