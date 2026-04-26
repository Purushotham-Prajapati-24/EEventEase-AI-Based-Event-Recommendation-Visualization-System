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

    // Join a specific chat room
    socket.on("join-chat", (chatId: string) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
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

        // Update Chat with last message
        await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });

        // Broadcast to the room
        io.to(chatId).emit("new-message", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Handle Read Receipts (WhatsApp Blue Ticks)
    socket.on("mark-as-read", async (data: {
      messageId: string;
      userId: string;
      chatId: string;
    }) => {
      try {
        const { messageId, userId, chatId } = data;

        const updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          {
            $addToSet: { readBy: { user: userId, readAt: new Date() } },
          },
          { new: true }
        );

        // Notify other participants in the chat
        io.to(chatId).emit("message-read", {
          messageId,
          userId,
          readAt: new Date(),
        });
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};
