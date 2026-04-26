import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchProfile, followUser, unfollowUser, clearProfile } from "../store/slices/profileSlice";
import { accessChat, setActiveChat } from "../store/slices/chatSlice";
import { logout } from "../store/slices/authSlice";
import { Button } from "../components/ui/button";
import { 
  Users, 
  UserPlus, 
  UserMinus,
  Calendar, 
  Edit3,
  MessageSquare,
  Clock,
  MapPin,
  Trash2,
  Trophy,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DotPattern } from "../components/ui/dot-pattern-1";
import { ProfileEditModal } from "../components/ProfileEditModal";
import { ConnectionsModal } from "../components/ConnectionsModal";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { User, EventData } from "../types";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { currentProfile, loading, error } = useSelector((state: RootState) => state.profile);
  const [activeTab, setActiveTab] = useState<"events" | "analytics" | "following">("events");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [connectionsModal, setConnectionsModal] = useState<{isOpen: boolean, type: "followers" | "following"}>({isOpen: false, type: "followers"});
  const [suggestions, setSuggestions] = useState<User[]>([]);

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    if (id) {
      dispatch(fetchProfile(id));
    }
    return () => { dispatch(clearProfile()); };
  }, [id, dispatch]);

  useEffect(() => {
    if (isOwnProfile && currentUser?._id) {
      import("../lib/api").then(({ default: api }) => {
        api.get("/users/suggestions").then((data) => {
          if (Array.isArray(data)) setSuggestions(data as User[]);
        }).catch(() => {});
      });
    }
  }, [isOwnProfile, currentUser?._id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-black text-red-500 uppercase tracking-tighter">Profile Not Found</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => navigate("/")} className="rounded-2xl px-8">Back to Home</Button>
      </div>
    );
  }

  if (!currentProfile) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Profile Hero */}
      <section className="container mx-auto px-8">
        <div className="glass rounded-[40px] border-primary/10 overflow-hidden relative">
          <div className="h-48 bg-white border-b border-border relative">
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
                      className={`rounded-2xl gap-2 h-11 px-6 shadow-lg transition-all active:scale-95 ${currentUser?.following?.includes(currentProfile._id) ? "bg-secondary hover:bg-secondary/90 shadow-secondary/20" : "bg-primary hover:bg-primary/90 shadow-primary/20"}`}
                      onClick={() => {
                        if (currentUser?.following?.includes(currentProfile._id)) {
                          dispatch(unfollowUser({ targetId: currentProfile._id, currentUserId: currentUser!._id }));
                        } else {
                          dispatch(followUser({ targetId: currentProfile._id, currentUserId: currentUser!._id }));
                        }
                      }}
                    >
                      {currentUser?.following?.includes(currentProfile._id) ? (
                        <>
                          <UserMinus className="h-4 w-4" /> Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" /> Follow
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-2xl gap-2"
                      onClick={async () => {
                        try {
                          const chat = await dispatch(accessChat(currentProfile._id)).unwrap();
                          dispatch(setActiveChat(chat));
                          navigate("/chat");
                        } catch (error) {
                          const err = error as { message?: string };
                          alert(err.message || "Could not start chat. You must follow each other.");
                        }
                      }}
                    >
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
                  <div 
                    className="flex items-center gap-3 text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setConnectionsModal({ isOpen: true, type: "followers" })}
                  >
                    <Users className="h-4 w-4 text-primary" />
                    <span>{currentProfile.followers?.length || 0} Followers</span>
                  </div>
                  <div 
                    className="flex items-center gap-3 text-sm font-medium cursor-pointer hover:text-secondary transition-colors"
                    onClick={() => setConnectionsModal({ isOpen: true, type: "following" })}
                  >
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

                <div className="pt-6 border-t border-primary/10">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest gap-2"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to deactivate your account? This action is permanent.")) {
                        try {
                          const { default: api } = await import("../lib/api");
                          await api.delete(`/users/${currentProfile._id}`);
                          dispatch(logout());
                          navigate("/login");
                        } catch (error) {
                          alert("Failed to deactivate account.");
                        }
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Deactivate Account
                  </Button>
                </div>
              </div>

              {/* People You May Know — own profile only */}
              {isOwnProfile && suggestions.length > 0 && (
                <div className="md:col-span-1 space-y-4 pt-4 border-t border-primary/10">
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">People You May Know</h3>
                  <div className="space-y-3">
                    {suggestions.map((person) => (
                      <div key={person._id} className="flex items-center gap-3 p-3 rounded-2xl glass border-primary/5 hover:border-primary/20 transition-all">
                        <img
                          src={person.profileImage || `https://i.pravatar.cc/80?u=${person._id}`}
                          alt={person.name}
                          className="h-10 w-10 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm truncate">{person.name}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{person.role}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {person.interests?.slice(0, 2).map((i: string) => (
                              <span key={i} className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">{i}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Button
                            size="sm"
                            className="h-7 px-3 rounded-full text-[10px] font-black uppercase tracking-widest"
                            onClick={() => {
                              dispatch(followUser({ targetId: person._id, currentUserId: currentUser!._id }));
                              setSuggestions(prev => prev.filter(p => p._id !== person._id));
                            }}
                          >
                            <UserPlus className="h-3 w-3 mr-1" /> Follow
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-3 rounded-full text-[10px] font-black uppercase tracking-widest"
                            onClick={async () => {
                              await dispatch(accessChat(person._id));
                              navigate("/chat");
                            }}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" /> Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  <button 
                    onClick={() => setActiveTab("following")}
                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors relative ${activeTab === "following" ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Following
                    {activeTab === "following" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {activeTab === "events" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(currentProfile.role === "organizer" ? currentProfile.organizedEvents : currentProfile.registeredEvents)?.map((event: EventData) => (
                        <motion.div 
                          key={event._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ y: -5 }}
                          className="glass rounded-[32px] border-primary/10 overflow-hidden group hover:border-primary/30 transition-all cursor-pointer flex flex-col"
                          onClick={() => navigate(`/event/${event._id}`)}
                        >
                          <div className="h-40 bg-slate-800 relative overflow-hidden shrink-0">
                            {event.posterUrl ? (
                              <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <Trophy className="h-12 w-12 text-white/20" />
                              </div>
                            )}
                            <div className="absolute top-4 left-4 flex gap-2">
                              <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                                {event.category || 'General'}
                              </div>
                            </div>
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/90 text-[9px] font-black text-white uppercase tracking-widest shadow-lg">
                              {event.status}
                            </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                            <h4 className="font-black tracking-tighter text-xl leading-tight group-hover:text-primary transition-colors mb-4 line-clamp-2">{event.title}</h4>
                            
                            <div className="grid grid-cols-2 gap-4 mt-auto">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5 text-primary" />
                                  {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5 text-secondary" />
                                  {event.time || "10:00 AM"}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                  <MapPin className="h-3.5 w-3.5 text-accent" />
                                  <span className="truncate">{event.location || "Main Hall"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                  <Users className="h-3.5 w-3.5 text-green-500" />
                                  {event.registeredAttendees?.length || 0} / {event.capacity || 100} Joined
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {event.tags?.slice(0, 2).map((tag: string) => (
                                    <span key={tag} className="px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary text-[8px] font-black uppercase tracking-widest">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {isOwnProfile && currentProfile.role === 'organizer' && (
                              <div className="mt-6 pt-4 border-t border-primary/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Activity className="h-3 w-3 text-primary" />
                                  <span className="text-[9px] font-black uppercase text-muted-foreground">Engagement: {((event._id.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)) % 40) + 60}%</span>
                                </div>
                                <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase tracking-widest">
                                  Manage →
                                </Button>
                              </div>
                            )}
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

                      <div className="glass p-8 rounded-[40px] border-primary/5 min-h-[300px] flex flex-col justify-center">
                        <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6 pl-4">
                          {currentProfile.role === "organizer" ? "Attendance Impact (Monthly)" : "Event Participation (Monthly)"}
                        </h4>
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            {currentProfile.role === "organizer" ? (
                              <BarChart data={[
                                { name: 'Jan', impact: 45 }, { name: 'Feb', impact: 80 }, 
                                { name: 'Mar', impact: 120 }, { name: 'Apr', impact: 90 },
                                { name: 'May', impact: 200 }, { name: 'Jun', impact: 150 }
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="currentColor" fontSize={10} tickLine={false} axisLine={false} opacity={0.5} />
                                <YAxis stroke="currentColor" fontSize={10} tickLine={false} axisLine={false} opacity={0.5} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="impact" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            ) : (
                              <LineChart data={[
                                { name: 'Jan', events: 2 }, { name: 'Feb', events: 5 }, 
                                { name: 'Mar', events: 3 }, { name: 'Apr', events: 8 },
                                { name: 'May', events: 4 }, { name: 'Jun', events: 7 }
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="currentColor" fontSize={10} tickLine={false} axisLine={false} opacity={0.5} />
                                <YAxis stroke="currentColor" fontSize={10} tickLine={false} axisLine={false} opacity={0.5} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}
                                />
                                <Line type="monotone" dataKey="events" stroke="currentColor" strokeWidth={3} className="stroke-secondary" dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                              </LineChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "following" && (
                    <div className="space-y-6">
                      <div className="glass p-12 rounded-[40px] border-primary/5 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-10 w-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black tracking-tight">Social Network</h3>
                          <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                            {isOwnProfile 
                              ? "Manage your connections and discover what your peers are attending." 
                              : `See who ${currentProfile.name} is following and who their followers are.`}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <Button 
                            className="rounded-full px-8 h-12 font-black uppercase tracking-widest text-[10px]"
                            onClick={() => setConnectionsModal({ isOpen: true, type: "followers" })}
                          >
                            View Followers
                          </Button>
                          <Button 
                            variant="outline"
                            className="rounded-full px-8 h-12 font-black uppercase tracking-widest text-[10px]"
                            onClick={() => setConnectionsModal({ isOpen: true, type: "following" })}
                          >
                            View Following
                          </Button>
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
        {connectionsModal.isOpen && (
          <ConnectionsModal 
            userId={currentProfile._id} 
            type={connectionsModal.type} 
            onClose={() => setConnectionsModal({ ...connectionsModal, isOpen: false })} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
