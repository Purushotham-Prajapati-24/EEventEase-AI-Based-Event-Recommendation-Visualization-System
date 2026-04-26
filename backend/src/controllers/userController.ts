import { Request, Response } from "express";
import User from "../models/User";

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
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error });
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
    // (Assuming notification logic is imported or handled via a service)
    // await createNotification({ recipient: id, sender: currentUserId, type: "follow", message: `${currentUser.name} followed you` });

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
