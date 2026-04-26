import express from "express";
import { getUsers, getUserById, createUser, updateProfile, followUser, unfollowUser, getSuggestedUsers, getUserConnections, deleteUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Suggestions must come BEFORE /:id to avoid being caught by the id param
router.get("/suggestions", protect, getSuggestedUsers);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/:id/connections", protect, getUserConnections);
router.post("/", createUser);

// Social & Profile Routes
router.put("/:id", protect, updateProfile);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);
router.delete("/:id", protect, deleteUser);

export default router;
