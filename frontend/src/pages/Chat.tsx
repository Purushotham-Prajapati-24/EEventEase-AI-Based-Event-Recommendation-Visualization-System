import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../store";
import { fetchChats, fetchMessages, setActiveChat, addMessage, fetchChatById } from "../store/slices/chatSlice";
import { Button } from "../components/ui/button";
import { 
  Send, 
  CheckCheck, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile,
  ChevronLeft,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { chats, activeChat, messages, loading } = useSelector((state: RootState) => state.chat);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Initialize socket once
  useEffect(() => {
    const newSocket = io(BACKEND_URL, { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("connected", () => setSocketConnected(true));

    return () => {
      newSocket.disconnect();
    };
  }, [BACKEND_URL]);

  // Setup personal room after socket connected
  useEffect(() => {
    if (socket && user && socketConnected) {
      socket.emit("setup", user._id);
    }
  }, [socket, user, socketConnected]);

  // Join chat room when active chat changes
  useEffect(() => {
    if (socket && activeChat) {
      socket.emit("join-chat", activeChat._id);
    }
  }, [socket, activeChat]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg: any) => {
      if (activeChat && activeChat._id === (newMsg.chat?._id || newMsg.chat)) {
        dispatch(addMessage(newMsg));
      }
    };

    socket.on("message recieved", handleNewMessage);
    
    socket.on("message-read", (data: { messageId: string, userId: string, readAt: Date }) => {
      // Find and update the specific message's readBy array in local state
      dispatch({ type: 'chat/updateMessageReadBy', payload: data });
    });

    return () => {
      socket.off("message recieved", handleNewMessage);
      socket.off("message-read");
    };
  }, [socket, activeChat, dispatch]);

  // Mark messages as read when active chat changes or new messages arrive
  useEffect(() => {
    if (socket && activeChat && messages.length > 0 && user) {
      const unreadMessages = messages.filter(
        (msg: any) => msg.sender?._id !== user._id && !msg.readBy?.some((r: any) => (r.user?._id || r.user) === user._id)
      );

      unreadMessages.forEach((msg: any) => {
        socket.emit("mark-as-read", {
          messageId: msg._id,
          userId: user._id,
          chatId: activeChat._id,
        });
      });
    }
  }, [socket, activeChat, messages, user]);

  // Auto-select chat from query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomId = params.get("room");
    if (roomId) {
      const chat = chats.find((c) => c._id === roomId);
      if (chat) {
        dispatch(setActiveChat(chat));
        dispatch(fetchMessages(chat._id));
      } else if (!loading) {
        // Fetch specific chat if not in list
        dispatch(fetchChatById(roomId)).then(() => {
          dispatch(fetchMessages(roomId));
        });
      }
    }
  }, [location.search, chats, loading, dispatch]);

  // Fetch chats on mount
  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  // Handle ?room= query parameter to auto-open chat
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get("room");
    if (roomId && roomId !== "undefined" && chats.length > 0 && !activeChat) {
      const targetChat = chats.find(c => c._id === roomId);
      if (targetChat) {
        dispatch(setActiveChat(targetChat));
        dispatch(fetchMessages(targetChat._id));
      }
    }
  }, [location.search, chats, activeChat, dispatch]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !activeChat || !user) return;

    socket.emit("send-message", {
      chatId: activeChat._id,
      senderId: user._id,
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  const getChatName = (chat: any) =>
    chat.participants?.find((p: any) => p._id !== user?._id)?.name || chat.groupName || "Unknown";

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="h-screen bg-background pt-20 flex overflow-hidden">
      {/* Chat Sidebar */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-primary/10 flex flex-col ${activeChat ? "hidden md:flex" : "flex"}`}>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tighter">Messages</h1>
            <div className={`h-2 w-2 rounded-full ${socketConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} title={socketConnected ? "Connected" : "Disconnected"} />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-primary/5 border border-primary/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {loading && <p className="text-center text-xs text-muted-foreground py-4">Loading chats...</p>}
          {!loading && chats.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-8 italic">No conversations yet.</p>
          )}
          {chats.map((chat) => (
            <motion.div
              key={chat._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                dispatch(setActiveChat(chat));
                dispatch(fetchMessages(chat._id));
              }}
              className={`p-4 rounded-2xl cursor-pointer transition-all ${activeChat?._id === chat._id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "glass hover:border-primary/20"}`}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
                  <img src={`https://i.pravatar.cc/150?u=${chat._id}`} alt="chat" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold truncate">{getChatName(chat)}</h4>
                    <span className={`text-[10px] ${activeChat?._id === chat._id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {chat.updatedAt ? formatTime(chat.updatedAt) : ""}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${activeChat?._id === chat._id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {chat.lastMessage?.content || "Start a conversation..."}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeChat ? "hidden md:flex" : "flex"}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-primary/10 flex items-center justify-between glass">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => dispatch(setActiveChat(null))}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="h-10 w-10 rounded-lg bg-slate-800 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${activeChat._id}`} alt="chat" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-sm">{getChatName(activeChat)}</h4>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender?._id === user?._id ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] space-y-1 flex flex-col ${msg.sender?._id === user?._id ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-2 rounded-2xl text-sm ${msg.sender?._id === user?._id ? "bg-primary text-primary-foreground rounded-tr-none" : "glass rounded-tl-none"}`}>
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-1 px-1">
                        <span className="text-[10px] text-muted-foreground">
                          {formatTime(msg.createdAt)}
                        </span>
                        {msg.sender?._id === user?._id && (
                          <CheckCheck className={`h-3 w-3 ${msg.readBy?.length > 1 ? "text-primary" : "text-muted-foreground"}`} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 glass m-4 rounded-[32px] border-primary/10 flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-xl"><Smile className="h-5 w-5" /></Button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !socketConnected}
                className="rounded-2xl h-12 w-12 p-0 flex items-center justify-center bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="h-24 w-24 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary animate-pulse">
              <MessageSquare className="h-12 w-12" />
            </div>
            <div className="max-w-xs space-y-2">
              <h3 className="text-xl font-black tracking-tighter">Your Campus Circle</h3>
              <p className="text-sm text-muted-foreground font-medium">
                Select a conversation or start a new one with students and organizers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
