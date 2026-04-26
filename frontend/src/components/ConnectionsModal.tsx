import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, UserPlus, UserMinus, MessageSquare, Users } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { followUser, unfollowUser } from "../store/slices/profileSlice";
import api from "../lib/api";

interface ConnectionsModalProps {
  userId: string;
  type: "followers" | "following";
  onClose: () => void;
}

export const ConnectionsModal = ({ userId, type, onClose }: ConnectionsModalProps) => {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        console.log(`[ConnectionsModal] Fetching ${type} for user: ${userId}`);
        const response = await api.get(`/users/${userId}/connections`);
        console.log("[ConnectionsModal] Response received:", response);
        
        // Handle both direct array and object with keys
        const list = response[type] || (Array.isArray(response) ? response : []);
        console.log(`[ConnectionsModal] Setting ${type} list:`, list);
        setConnections(list);
      } catch (error) {
        console.error("[ConnectionsModal] Failed to fetch connections:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchConnections();
    }
  }, [userId, type]);

  const handleFollowToggle = async (e: React.MouseEvent, person: any) => {
    e.stopPropagation();
    if (!currentUser) return;

    const isFollowing = currentUser.following?.includes(person._id);

    try {
      if (isFollowing) {
        await dispatch(unfollowUser({ targetId: person._id, currentUserId: currentUser._id })).unwrap();
      } else {
        await dispatch(followUser({ targetId: person._id, currentUserId: currentUser._id })).unwrap();
      }
      // Re-fetch to ensure sync (or we could rely on Redux update if it was globally consistent)
      // For now, let's just let Redux handle the button state via currentUser update
    } catch (error) {
      console.error("Failed to toggle follow status", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-md rounded-[40px] border border-primary/20 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-primary/5">
          <h2 className="text-xl font-black capitalize tracking-tight">{type}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-primary/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-4">
              <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></span>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading {type}...</p>
            </div>
          ) : connections.length === 0 ? (
            <div className="text-center p-12 space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary/20" />
              </div>
              <p className="font-bold text-muted-foreground italic">No {type} found.</p>
            </div>
          ) : (
            connections.map((person) => {
              const isFollowing = currentUser?.following?.includes(person._id);
              const isMe = person._id === currentUser?._id;

              return (
                <div 
                  key={person._id} 
                  className="flex items-center gap-4 p-4 rounded-3xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all cursor-pointer group" 
                  onClick={() => {
                    onClose();
                    navigate(`/profile/${person._id}`);
                  }}
                >
                  <img 
                    src={person.profileImage || `https://i.pravatar.cc/150?u=${person._id}`} 
                    alt={person.name} 
                    className="h-12 w-12 rounded-2xl object-cover shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black truncate group-hover:text-primary transition-colors">{person.name}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{person.role}</p>
                  </div>

                  {!isMe && currentUser && (
                    <Button
                      size="sm"
                      variant={isFollowing ? "outline" : "default"}
                      className={`h-9 rounded-full text-[10px] font-black uppercase tracking-widest gap-1.5 px-4 ${isFollowing ? 'border-primary/20' : 'shadow-lg shadow-primary/20'}`}
                      onClick={(e) => handleFollowToggle(e, person)}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="h-3 w-3" /> Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3 w-3" /> Follow
                        </>
                      )}
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
