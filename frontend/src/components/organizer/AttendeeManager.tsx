import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserMinus, UserPlus, Mail, Search, X, Users, ShieldAlert, Sparkles, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import type { User, EventData } from "@/types";

interface AttendeeManagerProps {
  eventId: string;
  onClose: () => void;
}

export const AttendeeManager = ({ eventId, onClose }: AttendeeManagerProps) => {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [blacklistedUsers, setBlacklistedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [localFilter, setLocalFilter] = useState("");

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const response: EventData = await api.get(`/events/${eventId}`);
      // Handle potential mix of string IDs and populated objects
      const attendees = (response.registeredAttendees || []).filter(u => typeof u !== 'string') as User[];
      const blacklisted = (response.blacklistedUsers || []).filter(u => typeof u !== 'string') as User[];
      
      setActiveUsers(attendees);
      setBlacklistedUsers(blacklisted);
    } catch (error) {
      console.error("Failed to fetch attendees", error);
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (userId: string) => {
    try {
      await api.post(`/events/${eventId}/remove/${userId}`);
      const userToRemove = activeUsers.find(u => u._id === userId);
      if (userToRemove) {
        setActiveUsers(activeUsers.filter(u => u._id !== userId));
        setBlacklistedUsers([...blacklistedUsers, userToRemove]);
      }
    } catch (error) {
      console.error("Remove failed", error);
    }
  };

  const reAddUser = async (userId: string) => {
    try {
      await api.post(`/events/${eventId}/readd/${userId}`);
      const userToReAdd = blacklistedUsers.find(u => u._id === userId);
      if (userToReAdd) {
        setBlacklistedUsers(blacklistedUsers.filter(u => u._id !== userId));
        setActiveUsers([...activeUsers, userToReAdd]);
      }
    } catch (error) {
      console.error("Re-add failed", error);
    }
  };

  const filteredActive = useMemo(() => {
    return activeUsers.filter(u => 
      u.name.toLowerCase().includes(localFilter.toLowerCase()) || 
      u.email.toLowerCase().includes(localFilter.toLowerCase())
    );
  }, [activeUsers, localFilter]);

  const filteredBlacklisted = useMemo(() => {
    return blacklistedUsers.filter(u => 
      u.name.toLowerCase().includes(localFilter.toLowerCase()) || 
      u.email.toLowerCase().includes(localFilter.toLowerCase())
    );
  }, [blacklistedUsers, localFilter]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl h-[85vh] flex flex-col"
      >
        <Card className="flex-1 overflow-hidden glass border-primary/20 shadow-2xl flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-gradient" />
          
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/5 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-3xl font-black tracking-tighter">
                  Attendee <span className="text-primary">Command</span> Center
                </CardTitle>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Full control over event registrations and permissions.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-all">
              <X className="h-6 w-6" />
            </Button>
          </CardHeader>
          
          <div className="p-6 border-b border-white/5 bg-black/20 flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
              <input 
                type="text" 
                placeholder="Search registered students..." 
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-primary/5 border border-primary/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all font-medium text-sm"
                value={localFilter}
                onChange={(e) => setLocalFilter(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <span className="text-xs font-bold text-green-500 uppercase tracking-wider">{activeUsers.length} Active</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-destructive" />
                <span className="text-xs font-bold text-destructive uppercase tracking-wider">{blacklistedUsers.length} Restricted</span>
              </div>
            </div>
          </div>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="font-bold animate-pulse">Syncing attendee data...</p>
              </div>
            ) : (
              <>
                {/* Active Attendees */}
                <section>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary/70 mb-6 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Active Roster
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                      {filteredActive.map(u => (
                        <motion.div 
                          key={u._id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group relative"
                        >
                          <div className="flex flex-col p-4 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all shadow-lg overflow-hidden h-full">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary overflow-hidden border border-primary/20 shadow-inner">
                                {u.profileImage ? (
                                  <img src={u.profileImage} alt={u.name} className="h-full w-full object-cover" />
                                ) : (
                                  u.name.charAt(0)
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-black text-foreground truncate">{u.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate font-medium">{u.email}</p>
                              </div>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => removeUser(u._id)} 
                                className="h-8 w-8 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {u.interests && u.interests.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-auto">
                                {u.interests.slice(0, 3).map(interest => (
                                  <span key={interest} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/10 text-primary">
                                    {interest}
                                  </span>
                                ))}
                                {u.interests.length > 3 && (
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">
                                    +{u.interests.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {filteredActive.length === 0 && (
                      <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-sm text-muted-foreground italic font-medium">No active registrations found.</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Restricted List */}
                {blacklistedUsers.length > 0 && (
                  <section className="pt-6 border-t border-white/5">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-destructive/70 mb-6 flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" /> Restricted Access
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredBlacklisted.map(u => (
                        <motion.div 
                          key={u._id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-4 p-4 rounded-3xl bg-destructive/5 border border-destructive/10 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all shadow-md group"
                        >
                          <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center font-black text-destructive text-sm">
                            {u.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm truncate">{u.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => reAddUser(u._id)} 
                            className="h-8 w-8 rounded-xl text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Invite Section */}
                <section className="pt-8 border-t border-white/5 bg-primary/5 -mx-6 px-6 pb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                        <Mail className="h-5 w-5 text-accent" /> Expand Your Reach
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">Invite specific students or send bulk registration links.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/50" />
                        <input 
                          type="email" 
                          placeholder="student@university.edu" 
                          className="pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none transition-all text-sm w-64"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button className="rounded-xl bg-accent hover:bg-accent/80 text-white font-bold shadow-lg shadow-accent/20 px-6">
                        Send Invite
                      </Button>
                    </div>
                  </div>
                </section>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
