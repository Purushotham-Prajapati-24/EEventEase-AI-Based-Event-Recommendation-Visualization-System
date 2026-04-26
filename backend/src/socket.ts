import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import Message from "./models/Message";
import Chat from "./models/Chat";

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Setup: join a personal room for direct notifications
    socket.on("setup", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined personal room`);
      socket.emit("connected");
    });

    // Join a specific chat room
    socket.on("join-chat", (chatId: string) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
    });

    // Handle sending messages
    socket.on("send-message", async (data: {
      chatId: string;
      senderId: string;
      content: string;
    }) => {
      try {
        const { chatId, senderId, content } = data;

        // Save to DB
        const newMessage = await Message.create({
          chat: chatId,
          sender: senderId,
          content,
        });

        // Populate sender info before broadcasting
        const populated = await Message.findById(newMessage._id)
          .populate("sender", "name profileImage email")
          .populate("chat");

        // Update Chat with last message
        await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });

        // Broadcast to the chat room (event name matches frontend listener)
        socket.to(chatId).emit("message recieved", populated);
        // Also send back to sender with populated data so their message appears
        socket.emit("message recieved", populated);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Handle Read Receipts
    socket.on("mark-as-read", async (data: {
      messageId: string;
      userId: string;
      chatId: string;
    }) => {
      try {
        const { messageId, userId, chatId } = data;

        await Message.findByIdAndUpdate(
          messageId,
          { $addToSet: { readBy: { user: userId, readAt: new Date() } } },
          { new: true }
        );

        io.to(chatId).emit("message-read", { messageId, userId, readAt: new Date() });
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
