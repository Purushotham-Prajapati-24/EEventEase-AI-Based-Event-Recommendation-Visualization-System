import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, UserPlus, MessageSquare, Users } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await api.get(`/users/${userId}/connections`);
        setConnections(response.data[type] || []);
      } catch (error) {
        console.error("Failed to fetch connections", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, [userId, type]);

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
            <div className="flex justify-center p-8">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
            </div>
          ) : connections.length === 0 ? (
            <div className="text-center p-8 opacity-50">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="font-bold">No {type} yet.</p>
            </div>
          ) : (
            connections.map((person) => (
              <div key={person._id} className="flex items-center gap-4 p-3 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all cursor-pointer" onClick={() => {
                onClose();
                navigate(`/profile/${person._id}`);
              }}>
                <img 
                  src={person.profileImage || `https://i.pravatar.cc/150?u=${person._id}`} 
                  alt={person.name} 
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-black truncate">{person.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{person.role}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
