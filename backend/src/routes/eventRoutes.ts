import express from "express";
import { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  getOrganizerEvents,
  removeUserFromEvent,
  reAddUserToEvent,
  registerForEvent,
  closeEvent
} from "../controllers/eventController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getEvents);
router.get("/organizer", protect, getOrganizerEvents);
router.get("/:id", getEventById);
router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);
router.post("/:id/register", protect, registerForEvent);
router.patch("/:id/close", protect, closeEvent);

// Attendee Management
router.post("/:eventId/remove/:userId", protect, removeUserFromEvent);
router.post("/:eventId/readd/:userId", protect, reAddUserToEvent);

export default router;
