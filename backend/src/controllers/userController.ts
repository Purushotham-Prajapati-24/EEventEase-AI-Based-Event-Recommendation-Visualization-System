import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import Event from "../models/Event";
import Notification from "../models/Notification";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await User.findById(id)
      .select("-passwordHash")
      .populate("registeredEvents")
      .populate("organizedEvents");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ 
      message: "Failed to fetch user", 
      error: error.message || "Internal Server Error" 
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    // In a real app, hash password before saving and generate JWT token
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error });
  }
};
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-passwordHash");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};

export const followUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    if (id === currentUserId) return res.status(400).json({ message: "You cannot follow yourself" });

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) return res.status(404).json({ message: "User not found" });

    if (currentUser.following.includes(id as any)) {
      return res.status(400).json({ message: "You already follow this user" });
    }

    await User.findByIdAndUpdate(id, { $push: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $push: { following: id } });

    // Trigger Notification
    await Notification.create({ 
      recipient: id, 
      sender: currentUserId, 
      type: "follow", 
      message: `${currentUser.name} started following you`,
      link: `/profile/${currentUserId}` 
    });

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to follow user", error });
  }
};

export const unfollowUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    await User.findByIdAndUpdate(id, { $pull: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } });

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unfollow user", error });
  }
};

export const getSuggestedUsers = async (req: any, res: Response) => {
  try {
    const currentUser = await User.findById(req.user._id).select("interests following");
    if (!currentUser || !currentUser.interests?.length) {
      return res.status(200).json([]);
    }

    const suggestions = await User.find({
      _id: { $ne: req.user._id, $nin: currentUser.following },
      interests: { $in: currentUser.interests },
    })
      .select("name email profileImage interests role")
      .limit(10);

    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: "Failed to get suggestions", error });
  }
};

export const getUserConnections = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id)
      .populate("followers", "name profileImage role bio")
      .populate("following", "name profileImage role bio");
      
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure we don't return nulls if populate failed for some reason
    const followers = user.followers.filter(f => f !== null);
    const following = user.following.filter(f => f !== null);

    res.status(200).json({
      followers,
      following
    });
  } catch (error) {
    console.error("Error in getUserConnections:", error);
    res.status(500).json({ message: "Failed to fetch connections", error });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    // Only allow users to delete their own account or admins
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized to delete this account" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove user references from others
    await User.updateMany({ following: id }, { $pull: { following: id } });
    await User.updateMany({ followers: id }, { $pull: { followers: id } });

    // Remove user from events
    await Event.updateMany({ registeredAttendees: id }, { $pull: { registeredAttendees: id } });
    
    // Actually delete the user
    await User.findByIdAndDelete(id);

    // Optional: Clean up notifications
    await Notification.deleteMany({ recipient: id });

    res.status(200).json({ message: "Account successfully deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to deactivate account", error });
  }
};
