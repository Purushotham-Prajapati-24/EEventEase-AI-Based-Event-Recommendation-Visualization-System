import { Request, Response } from "express";
import Notification from "../models/Notification";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ recipient: (req as any).user.id })
      .populate("sender", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error });
  }
};

export const createInvite = async (req: Request, res: Response) => {
  try {
    const { recipientId, message, eventId } = req.body;
    const notification = await Notification.create({
      recipient: recipientId,
      sender: (req as any).user.id,
      type: "invite",
      message,
      link: `/events/${eventId}`,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to send invite", error });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification", error });
  }
};
