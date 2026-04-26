import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store";
import { getEvents } from "@/store/slices/eventsSlice";
import { getRecommendations } from "@/store/slices/recommendationsSlice";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Target } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const Discovery = () => {
  const horizontalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { events } = useSelector((state: RootState) => state.events);
  const { recommendations } = useSelector((state: RootState) => state.recommendations);

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
      <div className="container mx-auto px-8 pt-20 pb-10">
        <div className="flex flex-col space-y-4">
          <h1 className="text-6xl font-black tracking-tighter text-gradient">
            Discover <span className="text-foreground">Events</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl">
            Find the best college events tailored just for you. Powered by AI, designed for students.
          </p>
        </div>
      </div>

      {/* GSAP Horizontal Scroll Section */}
      {user && recommendations && recommendations.length > 0 && (
        <div ref={containerRef} className="overflow-hidden bg-primary/5 py-24 border-y border-primary/10">
          <div className="container mx-auto px-8 mb-12">
            <h2 className="text-4xl font-black tracking-tight flex items-center gap-4">
              <span className="h-2 w-16 bg-primary rounded-full" /> 
              Recommended <span className="text-primary">for You</span>
            </h2>
          </div>
          
          <div ref={horizontalRef} className="flex gap-10 px-8 w-fit">
            {recommendations.map((rec) => (
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
                  <p className="line-clamp-3 text-base text-muted-foreground/90 italic font-medium">
                    "{rec.reason}"
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {rec.event.tags.map(tag => (
                      <span key={tag} className="bg-primary/10 text-primary text-xs font-black px-3 py-1.5 rounded-full border border-primary/20 uppercase tracking-tighter">
                        {tag}
                      </span>
                    ))}
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
          {events.map((event) => (
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
                  {event.tags.map(tag => (
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
// <label>
