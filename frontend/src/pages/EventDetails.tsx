import { MessageSquare, Megaphone, Info, CheckCircle, Bell, CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { getEvent, registerForEvent } from "@/store/slices/eventsSlice";
import { Button } from "@/components/ui/button";
import { AIScoreVisualization } from "@/components/events/AIScoreVisualization";

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { event, isLoading, isError, message } = useSelector((state: RootState) => state.events);
  const { user } = useSelector((state: RootState) => state.auth);
  const { recommendations } = useSelector((state: RootState) => state.recommendations);
  
  const recommendation = recommendations.find(r => r.event._id === id);
  const [activeTab, setActiveTab] = useState<"info" | "discussion" | "announcements">("info");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getEvent(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (event) {
      document.title = `${event.title} | EventEase`;
    }
  }, [event]);

  const handleRegister = async () => {
    if (!id) return;
    setIsRegistering(true);
    await dispatch(registerForEvent(id));
    setIsRegistering(false);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  if (isError) return <div className="p-8 text-center text-red-500">Error: {message}</div>;
  if (!event) return <div className="p-8 text-center">Event not found.</div>;

  const isRegistered = user && event.registeredAttendees?.includes(user._id);
  const isFull = (event.registeredAttendees?.length || 0) >= event.capacity;
  const isOrganizer = user && event.organizer?._id === user._id;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-8">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Navigation */}
        <Button variant="ghost" asChild className="mb-4 rounded-xl group hover:bg-primary/10">
          <Link to="/discovery" className="flex items-center gap-2 font-black tracking-widest text-xs uppercase">
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Discovery
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[40px] border-primary/10 overflow-hidden relative">
              <div className="h-96 w-full relative group">
                {event.posterUrl ? (
                  <img 
                    src={event.posterUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center">
                    <div className="text-5xl md:text-6xl font-black text-foreground tracking-tighter text-center px-4 italic opacity-20">
                      {event.title}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent flex items-end p-12">
                  <h1 className="text-5xl font-black tracking-tighter text-foreground leading-tight drop-shadow-2xl">
                    {event.title}
                  </h1>
                </div>
              </div>

              {/* Interaction Tabs */}
              <div className="flex px-8 border-b border-primary/5">
                {[
                  { id: "info", icon: Info, label: "Info" },
                  { id: "discussion", icon: MessageSquare, label: "Discussion" },
                  { id: "announcements", icon: Megaphone, label: "Updates" }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-5 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && <motion.div layoutId="eventTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                  </button>
                ))}
              </div>

              <div className="p-12">
                <AnimatePresence mode="wait">
                  {activeTab === "info" && (
                    <motion.div 
                      key="info"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                    >
                      {recommendation && (
                        <AIScoreVisualization 
                          matchScore={recommendation.matchScore}
                          popularityScore={recommendation.popularityScore}
                          overallScore={recommendation.score}
                          reason={recommendation.reason}
                          breakdown={recommendation.breakdown}
                        />
                      )}
                      <div className="flex flex-wrap gap-3">
                        {event.tags.map(tag => (
                          <span key={tag} className="bg-primary/5 border border-primary/10 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" /> About This Event
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "discussion" && (
                    <motion.div 
                      key="discussion"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 glass rounded-3xl p-12 border-primary/5"
                    >
                      {isRegistered ? (
                        <>
                          <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                            <MessageSquare className="h-8 w-8" />
                          </div>
                          <h4 className="text-xl font-black">Live Community Feed</h4>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            Coordinate with fellow students and organizers in the real-time discussion channel.
                          </p>
                          <Button asChild={!!event.discussionChat} disabled={!event.discussionChat} className="rounded-2xl gap-2 mt-4">
                            {event.discussionChat ? (
                              <Link to={`/chat?room=${event.discussionChat}`}>Open Discussion</Link>
                            ) : (
                              <span>Chat Generating...</span>
                            )}
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <h4 className="text-xl font-black opacity-40">Registered Members Only</h4>
                          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            Join the event to unlock the community discussion feed.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "announcements" && (
                    <motion.div 
                      key="announcements"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="glass p-8 rounded-3xl border-secondary/20 relative overflow-hidden">
                        <Bell className="absolute top-4 right-4 h-6 w-6 text-secondary/20" />
                        <h4 className="text-lg font-black tracking-tighter mb-2">Important Update</h4>
                        <p className="text-sm text-muted-foreground italic">"Official announcements from the organizer will appear here."</p>
                      </div>
                      
                      {isOrganizer && (
                        <Button asChild={!!event.announcementChat} disabled={!event.announcementChat} className="w-full rounded-2xl gap-2 bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20">
                          {event.announcementChat ? (
                            <Link to={`/chat?room=${event.announcementChat}`}>
                              <Megaphone className="h-4 w-4" /> Post Announcement
                            </Link>
                          ) : (
                            <span>Setting up...</span>
                          )}
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar / Registration Area */}
          <div className="space-y-8">
            <div className="glass p-10 rounded-[40px] border-primary/10 space-y-8 relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Date & Time</p>
                    <p className="text-sm font-black italic">{new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Location</p>
                    <p className="text-sm font-black italic">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:-rotate-12 transition-transform">
                    <UsersIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Availability</p>
                    <p className="text-sm font-black italic">{event.registeredAttendees?.length || 0} / {event.capacity} Registered</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-primary/5">
                {!user ? (
                  <Button asChild className="w-full h-16 rounded-[24px] text-lg font-black tracking-tighter" variant="outline">
                    <Link to="/login">Login to Join</Link>
                  </Button>
                ) : isRegistered ? (
                  <div className="space-y-4">
                    <div className="glass bg-primary/20 p-6 rounded-[24px] flex items-center justify-center gap-3 border-primary/30">
                      <CheckCircle className="h-6 w-6 text-primary" />
                      <span className="font-black italic text-primary uppercase tracking-widest text-xs">You're in!</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button asChild variant="outline" className="rounded-[20px] h-14 font-black uppercase tracking-widest text-[10px] gap-2 border-primary/20 hover:bg-primary/5">
                        <Link to={`/chat?room=${event.discussionChat}`}>
                          <MessageSquare className="w-4 h-4" /> Discussion
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-[20px] h-14 font-black uppercase tracking-widest text-[10px] gap-2 border-primary/20 hover:bg-primary/5">
                        <Link to={`/chat?room=${event.announcementChat}`}>
                          <Megaphone className="w-4 h-4 text-primary" /> Announcements
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : isFull ? (
                  <Button variant="destructive" className="w-full h-16 rounded-[24px] font-black opacity-50" disabled>
                    Registration Full
                  </Button>
                ) : (
                  <Button 
                    className="w-full h-16 rounded-[24px] text-lg font-black tracking-tighter shadow-xl shadow-primary/20"
                    onClick={handleRegister}
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Securing..." : "Secure My Spot"}
                  </Button>
                )}
              </div>
            </div>

            {/* Organizer Context */}
            <div className="glass p-8 rounded-[32px] border-primary/5 flex items-center gap-4 group cursor-pointer hover:border-primary/20 transition-all">
              <div className="h-14 w-14 rounded-2xl bg-slate-800 overflow-hidden shadow-xl border border-primary/10 group-hover:scale-105 transition-transform">
                <img src={`https://i.pravatar.cc/150?u=${event.organizer?._id}`} alt="organizer" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Organizer</p>
                <h4 className="font-black italic text-lg leading-none">{event.organizer?.name}</h4>
              </div>
              <Link to={`/profile/${event.organizer?._id}`}>
                <ArrowLeftIcon className="h-5 w-5 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// <label>
