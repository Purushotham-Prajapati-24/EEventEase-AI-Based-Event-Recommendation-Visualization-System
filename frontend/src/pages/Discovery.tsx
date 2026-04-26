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
import { Target, Sparkles, Zap, Activity, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const Discovery = () => {
  const horizontalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { events } = useSelector((state: RootState) => state.events);
  const { recommendations } = useSelector((state: RootState) => state.recommendations);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All", "Coding", "Tech", "Dance", "Management", "Sports", "Music", 
    "Art", "Design", "Business", "Networking", "Literature", "Gaming", 
    "Photography", "Film", "Science", "Robotics", "Finance", "Debate"
  ];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || event.tags.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [events, searchQuery, selectedCategory]);

  const filteredRecommendations = useMemo(() => {
    if (!recommendations) return [];
    return recommendations.filter(rec => {
      const matchesSearch = rec.event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || rec.event.tags.includes(selectedCategory);
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
    if (recommendations && recommendations.length > 0 && horizontalRef.current) {
      const el = horizontalRef.current;
      const totalWidth = el.scrollWidth - window.innerWidth + 100;

      gsap.to(el, {
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
    }
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [recommendations]);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Header */}
      <div className="container mx-auto px-8 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col space-y-4">
            <h1 className="text-7xl font-black tracking-tighter leading-none">
              Discover <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Events</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-xl border-l-4 border-primary/20 pl-6 py-2">
              Find the best college events tailored just for you. <span className="text-foreground font-bold">Powered by AI</span>, designed for the campus community.
            </p>
          </div>

          <div className="w-full md:w-96 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-xl group-focus-within:bg-primary/20 transition-all rounded-full" />
              <input 
                type="text" 
                placeholder="Search events, topics, clubs..."
                className="w-full h-14 bg-card/50 backdrop-blur-xl border-2 border-primary/10 rounded-full px-8 outline-none focus:border-primary transition-all relative z-10 font-bold placeholder:text-muted-foreground/50 shadow-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-primary/10 p-2 rounded-full">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="mt-12 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                  selectedCategory === category 
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(124,58,237,0.4)] scale-105" 
                    : "bg-card/40 border-primary/10 text-muted-foreground hover:border-primary/30 hover:bg-card/60"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GSAP Horizontal Scroll Section */}
      {user && filteredRecommendations && filteredRecommendations.length > 0 && (
        <div ref={containerRef} className="overflow-hidden bg-secondary/5 py-24 border-y border-border/50">
          <div className="container mx-auto px-8 mb-12">
            <h2 className="text-4xl font-black tracking-tight flex items-center gap-4">
              <span className="h-2 w-16 bg-primary rounded-full" /> 
              Recommended <span className="text-primary">for You</span>
            </h2>
          </div>
          
          <div ref={horizontalRef} className="flex gap-10 px-8 w-fit">
            {filteredRecommendations.map((rec) => (
              <Card key={rec.event._id} className="flex-shrink-0 w-[450px] flex flex-col h-full glass border-primary/30 shadow-2xl hover:border-primary transition-all group overflow-hidden">
                <div className="h-48 w-full overflow-hidden relative">
                  {rec.event.posterUrl ? (
                    <img src={rec.event.posterUrl} alt={rec.event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <Target className="h-10 w-10 text-primary/20" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary px-4 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-primary/20">
                      {Math.floor(rec.score)}% Sync
                    </span>
                  </div>
                </div>
                <CardHeader className="p-8 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2 block">
                    AI Analysis
                  </span>
                  <CardTitle className="text-3xl font-black group-hover:text-primary transition-colors">
                    {rec.event.title}
                  </CardTitle>
                  <CardDescription className="font-bold text-muted-foreground/80">
                    {new Date(rec.event.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex-1">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground/90 italic font-medium line-clamp-2">
                        "{rec.reason}"
                      </p>
                      <div className="flex flex-col items-end">
                        <span className="text-[24px] font-black leading-none text-primary">{Math.round(rec.score * 100)}%</span>
                        <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground opacity-60">Match</span>
                      </div>
                    </div>

                    {rec.breakdown && (
                      <div className="space-y-3">
                        <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden flex gap-0.5">
                          <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${rec.breakdown.topic}%` }} />
                          <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${rec.breakdown.skill}%` }} />
                          <div className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: `${rec.breakdown.community}%` }} />
                        </div>

                        <div className="flex justify-between items-center px-1">
                          <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              <span className="text-[9px] font-black uppercase text-muted-foreground">{rec.breakdown.topic}% Interest</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span className="text-[9px] font-black uppercase text-muted-foreground">{rec.breakdown.skill}% Skill</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              <span className="text-[9px] font-black uppercase text-muted-foreground">{rec.breakdown.community}% Social</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {rec.event.tags && rec.event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {rec.event.tags.map((tag) => (
                          <span key={tag} className="bg-primary/5 text-primary/70 text-[8px] font-black px-2 py-1 rounded-lg border border-primary/10 uppercase tracking-tighter">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button asChild className="w-full h-14 rounded-full shadow-xl bg-primary hover:scale-[1.03] transition-transform text-lg font-bold">
                    <Link to={`/events/${rec.event._id}`}>View Full Analysis</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Events Section */}
      <div className="container mx-auto p-8 pt-32 space-y-16">
        <h2 className="text-5xl font-black tracking-tight">
          Upcoming <span className="text-primary">Campus</span> Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredEvents.map((event) => (
            <Card key={event._id} className="flex flex-col h-full glass border-border/50 hover:border-primary/50 transition-all group shadow-xl hover:-translate-y-2 duration-300 overflow-hidden">
              <div className="h-48 w-full overflow-hidden">
                {event.posterUrl ? (
                  <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-4xl font-black opacity-10 italic">{event.title[0]}</span>
                  </div>
                )}
              </div>
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>
                <CardDescription className="font-bold">
                  {new Date(event.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 flex-1">
                <p className="line-clamp-3 text-sm text-muted-foreground font-medium">
                  {event.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="bg-secondary text-secondary-foreground text-[10px] font-black px-3 py-1.5 rounded-full border border-primary/10 uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-0">
                <Button asChild variant="outline" className="w-full h-12 rounded-full border-primary/20 hover:bg-primary/10 transition-all font-bold">
                  <Link to={`/events/${event._id}`}>Event Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
