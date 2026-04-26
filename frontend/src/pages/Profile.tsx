import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchProfile, followUser, clearProfile } from "../store/slices/profileSlice";
import { Button } from "../components/ui/button";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  BarChart3, 
  MapPin, 
  Link as LinkIcon,
  Edit3,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DotPattern } from "../components/ui/dot-pattern-1";
import { ProfileEditModal } from "../components/ProfileEditModal";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { currentProfile, loading } = useSelector((state: RootState) => state.profile);
  const [activeTab, setActiveTab] = useState<"events" | "analytics" | "following">("events");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    if (id) {
      dispatch(fetchProfile(id));
    }
    return () => {
      dispatch(clearProfile());
    };
  }, [id, dispatch]);

  if (loading || !currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Profile Hero */}
      <section className="container mx-auto px-8">
        <div className="glass rounded-[40px] border-primary/10 overflow-hidden relative">
          <div className="h-48 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 relative">
            <DotPattern className="opacity-10" />
          </div>
          
          <div className="px-12 pb-12 relative">
            <div className="flex flex-col md:flex-row items-end gap-8 -mt-16 relative z-10">
              <div className="h-32 w-32 rounded-[32px] border-4 border-background bg-slate-800 overflow-hidden shadow-2xl">
                <img 
                  src={currentProfile.profileImage || `https://i.pravatar.cc/150?u=${currentProfile._id}`} 
                  alt={currentProfile.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex-1 space-y-2 mb-2">
                <h1 className="text-4xl font-black tracking-tighter">{currentProfile.name}</h1>
                <p className="text-muted-foreground font-medium flex items-center gap-2">
                  <span className="capitalize px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold tracking-widest">
                    {currentProfile.role}
                  </span>
                  • {currentProfile.email}
                </p>
              </div>

              <div className="flex gap-4 mb-2">
                {isOwnProfile ? (
                  <Button variant="outline" className="rounded-2xl gap-2" onClick={() => setIsEditModalOpen(true)}>
                    <Edit3 className="h-4 w-4" /> Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      className="rounded-2xl gap-2"
                      onClick={() => dispatch(followUser(currentProfile._id))}
                    >
                      <UserPlus className="h-4 w-4" /> Follow
                    </Button>
                    <Button variant="outline" className="rounded-2xl gap-2">
                      <MessageSquare className="h-4 w-4" /> Message
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">About</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {currentProfile.bio || "No bio yet. This user is busy attending the coolest events on campus!"}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{currentProfile.followers?.length || 0} Followers</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <UserPlus className="h-4 w-4 text-secondary" />
                    <span>{currentProfile.following?.length || 0} Following</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(currentProfile.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Interests</h3>
                    {isOwnProfile && (
                      <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.interests && currentProfile.interests.length > 0 ? (
                      currentProfile.interests.map((interest: string) => (
                        <span 
                          key={interest}
                          className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black text-primary uppercase tracking-widest"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs italic text-muted-foreground">No interests listed yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 space-y-8">
                {/* Tabs */}
                <div className="flex gap-8 border-b border-primary/10">
                  <button 
                    onClick={() => setActiveTab("events")}
                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors relative ${activeTab === "events" ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {currentProfile.role === "organizer" ? "Hosted Events" : "Attended Events"}
                    {activeTab === "events" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab("analytics")}
                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors relative ${activeTab === "analytics" ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Analytics
                    {activeTab === "analytics" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {activeTab === "events" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(currentProfile.role === "organizer" ? currentProfile.organizedEvents : currentProfile.registeredEvents)?.map((event: any) => (
                        <motion.div 
                          key={event._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="glass rounded-3xl border-primary/10 overflow-hidden group hover:border-primary/30 transition-all cursor-pointer"
                        >
                          <div className="h-32 bg-slate-800 relative overflow-hidden">
                            {event.posterUrl ? (
                              <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                            )}
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest">
                              {event.status}
                            </div>
                          </div>
                          <div className="p-6 space-y-3">
                            <h4 className="font-black tracking-tighter text-lg leading-tight group-hover:text-primary transition-colors">{event.title}</h4>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.date).toLocaleDateString()}</span>
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.registeredAttendees?.length || 0} Attended</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {(!currentProfile.registeredEvents?.length && !currentProfile.organizedEvents?.length) && (
                        <div className="md:col-span-2 glass p-12 rounded-3xl border-primary/5 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                          <Calendar className="h-12 w-12 text-muted-foreground/20" />
                          <p className="text-sm font-medium text-muted-foreground">No active events in this cycle.</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === "analytics" && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass p-8 rounded-3xl border-primary/5 space-y-2">
                          <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">Participation</p>
                          <h4 className="text-3xl font-black">{currentProfile.roleMetadata?.totalAttended || 0}</h4>
                          <p className="text-xs text-primary font-bold">Total Events</p>
                        </div>
                        <div className="glass p-8 rounded-3xl border-secondary/5 space-y-2">
                          <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">Engagement</p>
                          <h4 className="text-3xl font-black">{currentProfile.roleMetadata?.averageRating || 0}/5</h4>
                          <p className="text-xs text-secondary font-bold">Avg Rating</p>
                        </div>
                        <div className="glass p-8 rounded-3xl border-accent/5 space-y-2">
                          <p className="text-xs uppercase tracking-widest font-black text-muted-foreground">Impact</p>
                          <h4 className="text-3xl font-black">{currentProfile.roleMetadata?.totalOrganized || 0}</h4>
                          <p className="text-xs text-accent font-bold">Events Organized</p>
                        </div>
                      </div>

                      <div className="glass p-12 rounded-[40px] border-primary/5 min-h-[200px] flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/20" />
                          <p className="text-sm font-medium text-muted-foreground italic">
                            Activity heatmap and interest clusters will appear here as more events are attended.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      <AnimatePresence>
        {isEditModalOpen && (
          <ProfileEditModal 
            user={currentProfile} 
            onClose={() => setIsEditModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
