import { Request, Response } from "express";
import Chat from "../models/Chat";
import Message from "../models/Message";
import User from "../models/User";

export const accessChat = async (req: any, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId not provided" });
  }

  let isChat: any = await Chat.find({
    isGroupChat: false,
    $and: [
      { participants: { $elemMatch: { $eq: req.user.id } } },
      { participants: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("participants", "-passwordHash")
    .populate("lastMessage");

  isChat = await User.populate(isChat, {
    path: "lastMessage.sender",
    select: "name profileImage email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      participants: [req.user.id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "participants",
        "-passwordHash"
      );
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400).json({ message: "Failed to create chat", error });
    }
  }
};

export const fetchChats = async (req: any, res: Response) => {
  try {
    Chat.find({ participants: { $elemMatch: { $eq: req.user.id } } })
      .populate("participants", "-passwordHash")
      .populate("groupAdmin", "-passwordHash")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .then(async (results: any) => {
        results = await User.populate(results, {
          path: "lastMessage.sender",
          select: "name profileImage email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch chats", error });
  }
};

export const fetchMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name profileImage email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch messages", error });
  }
};

export const getChatById = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("participants", "-passwordHash")
      .populate("groupAdmin", "-passwordHash")
      .populate("lastMessage");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const fullChat = await User.populate(chat, {
      path: "lastMessage.sender",
      select: "name profileImage email",
    });

    res.status(200).json(fullChat);
  } catch (error) {
    res.status(400).json({ message: "Failed to get chat", error });
  }
};
