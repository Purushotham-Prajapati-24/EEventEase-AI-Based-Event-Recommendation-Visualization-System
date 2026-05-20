import { Request, Response, NextFunction } from "express";
import Event from "../models/Event";

import Chat from "../models/Chat";

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await Event.find().populate("organizer", "name email");
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let event = await Event.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("registeredAttendees", "name email profileImage interests")
      .populate("blacklistedUsers", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Auto-create missing chats for older events
    let updated = false;
    if (!event.discussionChat) {
      const dChat = await Chat.create({ isGroupChat: true, groupName: `${event.title} - Discussion`, groupAdmin: event.organizer });
      event.discussionChat = dChat._id as any;
      updated = true;
    }
    if (!event.announcementChat) {
      const aChat = await Chat.create({ isGroupChat: true, groupName: `${event.title} - Announcements`, groupAdmin: event.organizer });
      event.announcementChat = aChat._id as any;
      updated = true;
    }
    
    if (updated) {
      await event.save();
    }

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizerId = (req as any).user.id;
    
    // Create discussion and announcement chats for the event
    const discussionChat = await Chat.create({
      isGroupChat: true,
      groupName: `${req.body.title} - Discussion`,
      groupAdmin: organizerId,
      participants: [organizerId]
    });
    
    const announcementChat = await Chat.create({
      isGroupChat: true,
      groupName: `${req.body.title} - Announcements`,
      groupAdmin: organizerId,
      participants: [organizerId]
    });

    const newEvent = new Event({
      ...req.body,
      organizer: organizerId,
      discussionChat: discussionChat._id,
      announcementChat: announcementChat._id,
    });
    
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    next(error);
  }
};

export const getOrganizerEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await Event.find({ organizer: (req as any).user.id })
      .populate("registeredAttendees", "name email interests");
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Enforce authorization check: only organizer or admin can edit
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this event" });
    }

    // Whitelist fields to prevent mass assignment
    const allowedFields = ["title", "description", "date", "location", "tags", "interests", "club", "capacity", "status", "posterUrl"];
    const updateData: Record<string, any> = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req: any, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    // Allow organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const removeUserFromEvent = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { eventId, userId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Allow organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to manage this event" });
    }

    // Remove from attendees, add to blacklist
    event.registeredAttendees = event.registeredAttendees.filter(id => id.toString() !== userId);
    if (!event.blacklistedUsers.includes(userId as any)) {
      event.blacklistedUsers.push(userId as any);
    }

    await event.save();
    res.status(200).json({ message: "User removed and blacklisted", event });
  } catch (error) {
    next(error);
  }
};

export const reAddUserToEvent = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { eventId, userId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Allow organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to manage this event" });
    }

    // Remove from blacklist, add back to attendees
    event.blacklistedUsers = event.blacklistedUsers.filter(id => id.toString() !== userId);
    if (!event.registeredAttendees.includes(userId as any)) {
      event.registeredAttendees.push(userId as any);
    }

    await event.save();
    res.status(200).json({ message: "User re-added to event", event });
  } catch (error) {
    next(error);
  }
};

export const registerForEvent = async (req: Request, res: Response, next: NextFunction) => {
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

    // Add event to User's registeredEvents
    await import("../models/User").then(({ default: User }) => {
      return User.findByIdAndUpdate(userId, { $addToSet: { registeredEvents: event._id } });
    });

    // Add user to chat rooms
    if (event.discussionChat) {
      await Chat.findByIdAndUpdate(event.discussionChat, { $addToSet: { participants: userId } });
    }
    if (event.announcementChat) {
      await Chat.findByIdAndUpdate(event.announcementChat, { $addToSet: { participants: userId } });
    }

    res.status(200).json({ message: "Registered successfully", event });
  } catch (error) {
    next(error);
  }
};

export const closeEvent = async (req: any, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to close this event" });
    }

    event.status = "completed";
    await event.save();

    res.status(200).json({ message: "Event closed successfully", event });
  } catch (error) {
    next(error);
  }
};