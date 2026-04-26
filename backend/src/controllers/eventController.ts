import { Request, Response } from "express";
import Event from "../models/Event";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().populate("organizer", "name email");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event", error });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const newEvent = new Event({
      ...req.body,
      organizer: (req as any).user.id, // Assuming auth middleware attaches user
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Failed to create event", error });
  }
};

export const getOrganizerEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ organizer: (req as any).user.id });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your events", error });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Failed to update event", error });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    if (event.organizer.toString() !== (req as any).user.id) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event", error });
  }
};

export const removeUserFromEvent = async (req: Request, res: Response) => {
  try {
    const { eventId, userId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Remove from attendees, add to blacklist
    event.registeredAttendees = event.registeredAttendees.filter(id => id.toString() !== userId);
    if (!event.blacklistedUsers.includes(userId as any)) {
      event.blacklistedUsers.push(userId as any);
    }

    await event.save();
    res.status(200).json({ message: "User removed and blacklisted", event });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove user", error });
  }
};

export const reAddUserToEvent = async (req: Request, res: Response) => {
  try {
    const { eventId, userId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Remove from blacklist, add back to attendees
    event.blacklistedUsers = event.blacklistedUsers.filter(id => id.toString() !== userId);
    if (!event.registeredAttendees.includes(userId as any)) {
      event.registeredAttendees.push(userId as any);
    }

    await event.save();
    res.status(200).json({ message: "User re-added to event", event });
  } catch (error) {
    res.status(500).json({ message: "Failed to re-add user", error });
  }
};

export const registerForEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    const userId = (req as any).user.id;

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if blacklisted
    if (event.blacklistedUsers.includes(userId as any)) {
      return res.status(403).json({ message: "You are blacklisted from this event" });
    }

    // Check if already registered
    if (event.registeredAttendees.includes(userId as any)) {
      return res.status(400).json({ message: "Already registered" });
    }

    // Check capacity
    if (event.registeredAttendees.length >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    event.registeredAttendees.push(userId as any);
    await event.save();

    res.status(200).json({ message: "Registered successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Failed to register for event", error });
  }
};
