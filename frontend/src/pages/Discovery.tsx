import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store";
import { getEvents } from "@/store/slices/eventsSlice";
import { getRecommendations } from "@/store/slices/recommendationsSlice";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Target, Filter, ChevronRight, Hash, Search, Grid, List, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const INTEREST_OPTIONS = [
  "All", "Coding", "Tech", "Dance", "Management", "Sports", "Music",
  "Art", "Design", "Business", "Networking", "Literature", "Gaming",
  "Photography", "Film", "Science", "Robotics", "Finance", "Debate"
];

export const Discovery = () => {
  const horizontalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { events } = useSelector((state: RootState) => state.events);
  const { recommendations } = useSelector((state: RootState) => state.recommendations);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || event.interests?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const filteredRecommendations = useMemo(() => {
    if (!recommendations) return [];
    return recommendations.filter(rec => {
      const matchesSearch = rec.event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || rec.event.interests?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [recommendations, searchQuery, selectedCategory]);

  useEffect(() => {
    dispatch(getEvents());
    if (user) {
      dispatch(getRecommendations(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (filteredRecommendations && filteredRecommendations.length > 0 && horizontalRef.current && containerRef.current) {
      const el = horizontalRef.current;
      const totalWidth = Math.max(0, el.scrollWidth - window.innerWidth + 100);

      const tween = gsap.to(el, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
        }
      });

      return () => {
        tween.kill();
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }
  }, [filteredRecommendations]);

  return (
    <div className="bg-background min-h-screen selection:bg-primary/30">
      {/* Hero Header */}
      <div className="container mx-auto px-8 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Discover your path</span>
            </div>
            <h1 className="text-8xl font-black tracking-tighter leading-[0.8] mb-4">
              Explore <br /> 
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient">The Pulse</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
              Where AI meets campus life. Discover events that actually match your <span className="text-foreground font-bold underline decoration-primary/50 decoration-2 underline-offset-4">vibe, skills, and future</span>.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-[450px] space-y-8"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/10 blur-2xl group-focus-within:bg-primary/20 transition-all rounded-3xl" />
              <div className="relative z-10 p-1 bg-card/40 backdrop-blur-3xl border border-primary/20 rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="flex items-center px-6 py-4">
                  <Search className="h-5 w-5 text-primary/50 mr-4" />
                  <input 
                    type="text" 
                    placeholder="Search events, topics, clubs..."
                    className="flex-1 bg-transparent border-none outline-none font-bold placeholder:text-muted-foreground/30 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-all">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Filter className="h-4 w-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-primary/70">Top Categories</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(showAllCategories ? INTEREST_OPTIONS : INTEREST_OPTIONS.slice(0, 10)).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedCategory === cat 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                        : "bg-card/30 border-primary/10 text-muted-foreground hover:border-primary/40 hover:bg-card/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {!showAllCategories && (
                  <button 
                    onClick={() => setShowAllCategories(true)}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
                  >
                    More...
                  </button>
                )}
                {showAllCategories && (
                  <button 
                    onClick={() => setShowAllCategories(false)}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-all"
                  >
                    Show Less
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* GSAP Horizontal Scroll Section */}
      {user && filteredRecommendations && filteredRecommendations.length > 0 && (
        <div ref={containerRef} className="overflow-hidden bg-primary/5 py-32 border-y border-primary/10 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]" />
          
          <div className="container mx-auto px-8 mb-16 relative z-10">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <h2 className="text-5xl font-black tracking-tighter flex items-center gap-4">
                  AI <span className="text-primary underline decoration-primary/30 decoration-8 underline-offset-[12px]">Curated</span> Picks
                </h2>
                <p className="text-muted-foreground font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" /> Personalized recommendations based on your profile & growth.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/60 border border-primary/20 px-4 py-2 rounded-full">
                Scroll to explore <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </div>
          
          <div ref={horizontalRef} className="flex gap-12 px-8 w-fit relative z-10 pb-10">
            {filteredRecommendations.map((rec) => (
              <motion.div 
                key={rec.event._id}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="flex-shrink-0 w-[480px] flex flex-col h-full glass border-primary/30 shadow-2xl hover:border-primary transition-all group overflow-hidden rounded-[2.5rem]">
                  <div className="h-56 w-full overflow-hidden relative">
                    {rec.event.posterUrl ? (
                      <img src={rec.event.posterUrl} alt={rec.event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Target className="h-16 w-16 text-primary/20 animate-pulse" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/40 backdrop-blur-md border border-white/10">
                        <Hash className="h-3 w-3 text-white" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                          {rec.event.club || "Campus Event"}
                        </span>
                      </div>
                      <div className="px-4 py-1.5 rounded-full bg-primary backdrop-blur-md text-white border border-primary/50 shadow-xl shadow-primary/20">
                        <span className="text-[12px] font-black uppercase tracking-widest">
                          {Math.floor(rec.score)}% Sync
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-4xl font-black group-hover:text-primary transition-colors leading-tight mb-2">
                      {rec.event.title}
                    </CardTitle>
                    <CardDescription className="font-black text-muted-foreground flex items-center gap-2 text-sm">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      {new Date(rec.event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 flex-1">
                    <div className="space-y-8">
                      <div className="relative p-4 rounded-2xl bg-primary/5 border border-primary/10 border-l-4 border-l-primary italic font-medium text-sm text-muted-foreground leading-relaxed">
                        "{rec.reason}"
                      </div>

                      {rec.breakdown && (
                        <div className="space-y-4">
                          <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden flex gap-0.5 p-[1px]">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${rec.breakdown.topic}%` }}
                              className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] rounded-l-full" 
                            />
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${rec.breakdown.skill}%` }}
                              className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                            />
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${rec.breakdown.community}%` }}
                              className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] rounded-r-full" 
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">Interest</span>
                              <span className="text-xs font-black text-blue-500">{rec.breakdown.topic}%</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">Growth</span>
                              <span className="text-xs font-black text-emerald-500">{rec.breakdown.skill}%</span>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                              <span className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">Social</span>
                              <span className="text-xs font-black text-amber-500">{rec.breakdown.community}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {rec.event.interests && rec.event.interests.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {rec.event.interests.map((interest: string) => (
                            <span key={interest} className="bg-primary/5 text-primary/70 text-[9px] font-black px-3 py-1.5 rounded-xl border border-primary/10 uppercase tracking-tighter">
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0 mt-auto">
                    <Button asChild className="w-full h-16 rounded-2xl shadow-xl bg-primary hover:bg-primary/90 transition-all text-lg font-black group/btn">
                      <Link to={`/events/${rec.event._id}`} className="flex items-center justify-center gap-2">
                        View Analysis <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Events Section */}
      <div className="container mx-auto p-8 pt-32 space-y-16 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-6xl font-black tracking-tighter leading-none">
              All <span className="text-primary underline decoration-primary/20 underline-offset-8">Live</span> Events
            </h2>
            <p className="text-muted-foreground font-medium">Browse everything happening across campus.</p>
          </div>
          <div className="flex gap-2 bg-card/40 backdrop-blur-xl p-1.5 rounded-2xl border border-primary/10 shadow-xl">
             <Button 
               variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
               size="sm" 
               onClick={() => setViewMode('list')}
               className={`rounded-xl font-bold ${viewMode === 'list' ? 'bg-primary text-white shadow-lg' : ''}`}
             >
               <List className="h-4 w-4 mr-2" /> List
             </Button>
             <Button 
               variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
               size="sm" 
               onClick={() => setViewMode('grid')}
               className={`rounded-xl font-bold ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : ''}`}
             >
               <Grid className="h-4 w-4 mr-2" /> Grid
             </Button>
          </div>
        </div>

        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" 
          : "flex flex-col gap-6"
        }>
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event, index) => (
              <motion.div 
                key={event._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row'} h-full glass border-primary/10 hover:border-primary/40 transition-all group shadow-2xl hover:-translate-y-2 duration-500 overflow-hidden rounded-[2rem]`}>
                  <div className={`${viewMode === 'grid' ? 'h-52 w-full' : 'h-48 w-72'} overflow-hidden relative flex-shrink-0`}>
                    {event.posterUrl ? (
                      <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                        <span className="text-5xl font-black opacity-10 italic">{event.title[0]}</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 rounded-full bg-background/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-foreground border border-border/50">
                        {event.club}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="p-8">
                    <CardTitle className="text-3xl font-black group-hover:text-primary transition-colors leading-tight mb-2 line-clamp-1">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="font-bold flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {new Date(event.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 flex-1">
                    <p className="line-clamp-2 text-sm text-muted-foreground font-medium leading-relaxed mb-8">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.interests?.map((interest: string) => (
                        <span key={interest} className="bg-primary/5 text-primary/60 text-[9px] font-black px-3 py-1.5 rounded-xl border border-primary/10 uppercase tracking-tighter">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0 mt-auto">
                    <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all font-black group/link">
                      <Link to={`/events/${event._id}`} className="flex items-center justify-center gap-2">
                        Full Briefing <ChevronRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

