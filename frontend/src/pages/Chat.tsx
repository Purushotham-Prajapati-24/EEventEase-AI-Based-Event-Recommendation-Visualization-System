import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../store";
import { fetchChats, fetchMessages, setActiveChat, addMessage, updateMessageReadBy, accessChat } from "../store/slices/chatSlice";
import { Button } from "../components/ui/button";
import { 
  Send, 
  CheckCheck, 
  Search, 
  Smile,
  ChevronLeft,
  MessageSquare,
  Megaphone,
  Info,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";

const Chat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { chats, activeChat, messages, loading, messagesLoading } = useSelector((state: RootState) => state.chat);
  const [newMessage, setNewMessage] = useState("");
  const [showInfo, setShowInfo] = useState(false);
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
      dispatch(updateMessageReadBy(data));
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
    if (roomId && chats.length > 0) {
      const chat = chats.find((c) => c._id === roomId);
      if (chat && (!activeChat || activeChat._id !== roomId)) {
        dispatch(setActiveChat(chat));
        dispatch(fetchMessages(chat._id));
      }
    }
  }, [location.search, chats, activeChat, dispatch]);

  // Fetch chats on mount
  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !activeChat || !user) return;

    // Check permissions for Announcement channels
    const isAnnouncement = activeChat.groupName?.toLowerCase().includes("announcement");
    if (activeChat.isGroupChat && isAnnouncement && !isChatAdmin(activeChat)) {
      return;
    }

    socket.emit("send-message", {
      chatId: activeChat._id,
      senderId: user._id,
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  const startDirectMessage = async (userId: string) => {
    if (userId === user?._id) return;
    try {
      const chat = await dispatch(accessChat(userId)).unwrap();
      dispatch(setActiveChat(chat));
      dispatch(fetchMessages(chat._id));
      setShowInfo(false);
    } catch (error) {
      console.error("Failed to access chat:", error);
    }
  };

  const getChatName = (chat: any) => {
    if (chat.isGroupChat) {
      if (chat.groupName?.includes(" - Discussion")) {
        return `${chat.groupName.split(" - ")[0]} + Discussion Group`;
      }
      return chat.groupName;
    }
    return chat.participants?.find((p: any) => p._id !== user?._id)?.name || "Unknown";
  };

  const getChatImage = (chat: any) => {
    if (chat.isGroupChat) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.groupName)}&background=random&color=fff&bold=true`;
    }
    const otherParticipant = chat.participants?.find((p: any) => p._id !== user?._id);
    return otherParticipant?.profileImage || `https://i.pravatar.cc/150?u=${chat._id}`;
  };

  const isChatAdmin = (chat: any) => {
    if (!chat || !user) return false;
    const adminId = (chat.groupAdmin?._id || chat.groupAdmin)?.toString();
    const userId = user._id?.toString();
    return adminId && userId && adminId === userId;
  };

  return (
    <div className="h-screen bg-background pt-20 flex overflow-hidden">
      {/* Chat Sidebar */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-primary/10 flex flex-col ${activeChat ? "hidden md:flex" : "flex"}`}>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">Messages</h1>
            <div className={`h-2 w-2 rounded-full ${socketConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} title={socketConnected ? "Connected" : "Disconnected"} />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 bg-primary/5 border border-primary/10 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
          {loading && <p className="text-center text-xs font-black uppercase tracking-widest text-muted-foreground py-4 animate-pulse">Syncing Chats...</p>}
          {!loading && chats.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-12 italic">No conversations found.</p>
          )}
          {chats.map((chat) => (
            <motion.div
              key={chat._id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                dispatch(setActiveChat(chat));
                dispatch(fetchMessages(chat._id));
              }}
              className={`p-4 rounded-[24px] cursor-pointer transition-all ${activeChat?._id === chat._id ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" : "glass hover:border-primary/20"}`}
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-800 overflow-hidden flex-shrink-0 border border-white/10">
                  <img src={getChatImage(chat)} alt="chat" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-sm truncate uppercase tracking-tight">{getChatName(chat)}</h4>
                    <span className={`text-[10px] font-black italic ${activeChat?._id === chat._id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                  </div>
                  <p className={`text-xs truncate font-medium mt-1 ${activeChat?._id === chat._id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {chat.lastMessage?.content || "Start a conversation..."}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col relative ${!activeChat ? "hidden md:flex" : "flex"}`}>
        {activeChat ? (
          <div className="flex h-full overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat Header */}
              <div className="p-4 border-b border-primary/10 flex items-center justify-between glass sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden rounded-xl"
                    onClick={() => dispatch(setActiveChat(null))}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="h-12 w-12 rounded-2xl bg-slate-800 overflow-hidden border border-primary/10 shadow-lg">
                    <img src={getChatImage(activeChat)} alt="chat" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-base tracking-tight flex items-center gap-2">
                      {getChatName(activeChat)}
                      {activeChat.groupName?.includes("Announcements") && (
                        <Megaphone className="h-4 w-4 text-primary animate-pulse" />
                      )}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${activeChat.groupName?.includes("Announcements") ? 'bg-primary' : 'bg-green-500 animate-pulse'}`} />
                      <span className="text-[10px] text-primary font-black uppercase tracking-widest">
                        {activeChat.isGroupChat ? (
                          activeChat.groupName?.includes("Announcements") ? 'Official Announcements' : `${activeChat.participants.length} Participants`
                        ) : 'Online'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowInfo(!showInfo)}
                    className={`rounded-xl transition-all ${showInfo ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col">
                {messagesLoading ? (
                  <div className="flex-1 flex items-center justify-center text-xs font-black uppercase tracking-widest opacity-20 animate-pulse">Syncing Messages...</div>
                ) : messages.map((msg: any, idx: number) => {
                  const isMe = msg.sender?._id === user?._id;
                  const showAvatar = idx === 0 || messages[idx-1].sender?._id !== msg.sender?._id;
                  
                  return (
                    <motion.div 
                      key={msg._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`h-9 w-9 rounded-xl overflow-hidden shrink-0 mt-1 transition-transform group-hover:scale-110 shadow-md ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                          <img src={msg.sender?.profileImage || `https://i.pravatar.cc/150?u=${msg.sender?._id}`} alt="avatar" />
                        </div>
                        <div className="space-y-1">
                          {!isMe && showAvatar && (
                            <span className="text-[10px] font-black text-muted-foreground ml-2 uppercase tracking-widest italic">
                              {msg.sender?.name}
                            </span>
                          )}
                          <div className={`p-4 rounded-[24px] text-sm font-medium relative shadow-sm ${
                            isMe 
                              ? 'bg-primary text-primary-foreground rounded-tr-none' 
                              : 'bg-primary/5 border border-primary/10 rounded-tl-none backdrop-blur-sm'
                          }`}>
                            {msg.content}
                            <div className={`flex items-center gap-1 mt-1 justify-end ${isMe ? 'text-primary-foreground/60' : 'text-muted-foreground/60'}`}>
                              <span className="text-[9px] font-black uppercase italic">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMe && (
                                <div className="flex -space-x-1 ml-1">
                                  {(() => {
                                    const readCount = msg.readBy?.length || 0;
                                    const totalOthers = (activeChat.participants?.length || 1) - 1;
                                    const isFullyRead = activeChat.isGroupChat 
                                      ? readCount >= totalOthers 
                                      : readCount > 0;
                                    
                                    const tickColor = isFullyRead ? "#34B7F1" : "currentColor";
                                    const tickOpacity = isFullyRead ? "1" : "0.4";

                                    return (
                                      <CheckCheck 
                                        className="h-3 w-3 transition-colors duration-300" 
                                        style={{ color: tickColor, opacity: tickOpacity }} 
                                      />
                                    );
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Input Area */}
              {activeChat.isGroupChat && activeChat.groupName?.includes("Announcements") && !isChatAdmin(activeChat) ? (
                <div className="p-6 glass m-4 rounded-[32px] border-secondary/20 bg-secondary/5 flex items-center justify-center gap-3 text-secondary">
                  <Megaphone className="h-5 w-5 animate-pulse" />
                  <p className="text-sm font-black uppercase tracking-widest italic">Only the event organizer can post in this channel</p>
                </div>
              ) : (
                <div className="p-4 glass m-4 rounded-[32px] border-primary/10 flex items-center gap-4 bg-background/50 backdrop-blur-xl shadow-2xl">
                  <Button variant="ghost" size="icon" className="rounded-xl"><Smile className="h-5 w-5" /></Button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !socketConnected}
                    className="rounded-2xl h-12 w-12 p-0 flex items-center justify-center bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-105"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Info Sidebar */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="w-80 bg-background/95 backdrop-blur-2xl border-l border-primary/10 p-8 z-20 overflow-y-auto hidden lg:block"
                >
                  <div className="space-y-10">
                    <div className="text-center space-y-6">
                      <div className="h-40 w-40 rounded-[48px] overflow-hidden mx-auto border-4 border-primary/10 shadow-2xl group transition-all hover:border-primary/30">
                        <img src={getChatImage(activeChat)} alt="info" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none">{getChatName(activeChat)}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-3 bg-primary/10 inline-block px-3 py-1 rounded-full">
                          {activeChat.isGroupChat ? 'Group Discussion' : 'Direct Message'}
                        </p>
                      </div>
                    </div>

                    {activeChat.isGroupChat && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" /> Members ({activeChat.participants.length})
                          </h5>
                        </div>
                        <div className="space-y-3">
                          {activeChat.participants.map((member: any) => (
                            <div 
                              key={member._id} 
                              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-primary/5 transition-all group cursor-pointer border border-transparent hover:border-primary/10 shadow-sm"
                              onClick={() => startDirectMessage(member._id)}
                            >
                              <div className="h-11 w-11 rounded-xl overflow-hidden bg-slate-800 border border-primary/5 shrink-0 shadow-md">
                                <img src={member.profileImage || `https://i.pravatar.cc/150?u=${member._id}`} alt={member.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-black truncate">{member.name}</p>
                                <p className={`text-[9px] font-black uppercase tracking-widest ${(activeChat.groupAdmin?._id || activeChat.groupAdmin)?.toString() === member._id ? 'text-primary' : 'text-muted-foreground'}`}>
                                  {(activeChat.groupAdmin?._id || activeChat.groupAdmin)?.toString() === member._id ? 'Organizer' : 'Attendee'}
                                </p>
                              </div>
                              {member._id !== user?._id && (
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                  <MessageSquare className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-8">
            <div className="h-32 w-32 rounded-[48px] bg-primary/5 border border-primary/10 flex items-center justify-center text-primary relative group">
              <div className="absolute inset-0 bg-primary/10 rounded-[48px] animate-ping opacity-20" />
              <MessageSquare className="h-16 w-16 transition-transform group-hover:scale-110 duration-500" />
            </div>
            <div className="max-w-sm space-y-4">
              <h3 className="text-3xl font-black tracking-tighter uppercase italic">Your Campus Circle</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Connect with event attendees, share insights in discussion groups, and get direct updates from organizers.
              </p>
              <Button onClick={() => dispatch(fetchChats())} variant="outline" className="rounded-2xl font-black uppercase tracking-widest text-[10px] px-8 border-primary/20 hover:bg-primary/5">
                Refresh Conversations
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
