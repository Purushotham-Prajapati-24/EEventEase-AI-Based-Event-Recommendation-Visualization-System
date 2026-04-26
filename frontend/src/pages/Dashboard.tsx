import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { getRecommendations } from "@/store/slices/recommendationsSlice";
import { getEvents } from "@/store/slices/eventsSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { Activity, TrendingUp, Calendar, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { recommendations, isLoading } = useSelector((state: RootState) => state.recommendations);
  const { events } = useSelector((state: RootState) => state.events);
  const registeredEvents = useMemo(() => {
    return events.filter(e => e.registeredAttendees?.some((a: any) => 
      (typeof a === 'string' ? a === user?._id : a._id === user?._id)
    ));
  }, [events, user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getRecommendations(user._id));
      dispatch(getEvents());
    }
  }, [user, navigate, dispatch]);

  // Data for Interest Radar (Real Alignment)
  const radarData = useMemo(() => {
    if (!recommendations.length) {
      return [
        { subject: 'Topic', A: 20, fullMark: 100 },
        { subject: 'Skill', A: 20, fullMark: 100 },
        { subject: 'Community', A: 20, fullMark: 100 },
      ];
    }

    // Calculate average breakdown across all recommendations
    const avgBreakdown = recommendations.reduce((acc, rec) => {
      const b = rec.breakdown || { topic: rec.matchScore, skill: rec.matchScore, community: rec.matchScore };
      return {
        topic: acc.topic + (b.topic || 0),
        skill: acc.skill + (b.skill || 0),
        community: acc.community + (b.community || 0)
      };
    }, { topic: 0, skill: 0, community: 0 });

    const count = recommendations.length;
    
    return [
      { subject: 'Topic Alignment', A: Math.round(avgBreakdown.topic / count), fullMark: 100 },
      { subject: 'Skill Match', A: Math.round(avgBreakdown.skill / count), fullMark: 100 },
      { subject: 'Community Fit', A: Math.round(avgBreakdown.community / count), fullMark: 100 },
    ];
  }, [recommendations]);

  // Data for Trending Bar Chart
  const trendingData = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    events.forEach(e => {
      (e.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [events]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-8 rounded-3xl border-primary/20 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Welcome, <span className="text-primary">{user.name}</span>!
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" /> Your AI-powered event ecosystem is ready.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild className="rounded-full px-8 shadow-lg hover:scale-105 transition-all">
            <Link to="/discovery">Explore Events</Link>
          </Button>
          <Button variant="outline" onClick={handleLogout} className="rounded-full border-primary/20">
            Logout
          </Button>
        </div>
      </div>

      {/* Visual Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart: Interest Match */}
        <Card className="lg:col-span-1 glass border-primary/10 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Interest Profile
            </CardTitle>
            <CardDescription>Your interest alignment with campus events.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--foreground)' }} />
                <Radar
                  name="You"
                  dataKey="A"
                  stroke="#7C3AED"
                  fill="#7C3AED"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart: Trending Categories */}
        <Card className="lg:col-span-2 glass border-primary/10 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" /> Trending Categories
            </CardTitle>
            <CardDescription>Most frequent event types on campus this week.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--primary)' }}
                />
                <Bar dataKey="count" fill="url(#colorBar)" radius={[10, 10, 0, 0]}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Schedule and Interests Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass border-primary/10 overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Your Schedule
            </CardTitle>
            <CardDescription>Events you are currently registered for.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {registeredEvents.length > 0 ? registeredEvents.map(event => (
                <div key={event._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{event.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()} at {event.location}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="rounded-full">
                    <Link to={`/events/${event._id}`}>Details</Link>
                  </Button>
                </div>
              )) : (
                <div className="py-8 text-center text-muted-foreground italic bg-white/5 rounded-2xl border border-dashed border-white/10">
                  No events in your schedule yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" /> AI Alignment Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Based on your interest in <span className="text-accent font-bold">{(user?.interests || [])[0] || 'Learning'}</span>, 
            you might enjoy events tagged with <span className="text-primary">Social</span> or <span className="text-primary">Career</span>. 
            We've found {recommendations.length} high-match opportunities for you today.
          </CardContent>
          <CardFooter>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                className="h-full bg-accent"
              />
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Recommendations Feed */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-primary animate-pulse" />
          AI <span className="text-primary">Spotlight</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-2 border-primary/20">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xl font-medium text-muted-foreground">Analyzing your interests...</p>
              </div>
            </div>
          ) : recommendations?.map((rec, index) => (
            <motion.div
              key={rec.event._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="glass border-primary/30 group hover:border-primary transition-all overflow-hidden shadow-lg h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-primary" /> Match Score: {Math.floor(rec.score)}%
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">{rec.event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> {new Date(rec.event.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground/90 italic font-medium line-clamp-2">
                      "{rec.reason}"
                    </p>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[20px] font-black leading-none text-primary">{Math.round(rec.score)}%</span>
                      <span className="text-[7px] font-black uppercase tracking-tighter text-muted-foreground opacity-60">Match</span>
                    </div>
                  </div>
                  
                  {rec.breakdown && (
                    <div className="space-y-3 pt-2">
                      <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden flex gap-0.5">
                        <div 
                          className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)] transition-all duration-1000 delay-500" 
                          style={{ width: `${rec.breakdown.topic}%` }} 
                        />
                        <div 
                          className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-1000 delay-700" 
                          style={{ width: `${rec.breakdown.skill}%` }} 
                        />
                        <div 
                          className="h-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] transition-all duration-1000 delay-900" 
                          style={{ width: `${rec.breakdown.community}%` }} 
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-3">
                          <div className="flex items-center gap-1">
                            <div className="h-1 w-1 rounded-full bg-blue-500" />
                            <span className="text-[8px] font-black uppercase text-muted-foreground/70">{rec.breakdown.topic}% Topic</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-1 w-1 rounded-full bg-emerald-500" />
                            <span className="text-[8px] font-black uppercase text-muted-foreground/70">{rec.breakdown.skill}% Skill</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-1 w-1 rounded-full bg-amber-500" />
                            <span className="text-[8px] font-black uppercase text-muted-foreground/70">{rec.breakdown.community}% Social</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Button asChild className="w-full rounded-full bg-linear-to-r from-primary to-accent border-none shadow-md hover:shadow-primary/20 hover:scale-[1.02] transition-all">
                    <Link to={`/events/${rec.event._id}`}>Deep Analysis</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
