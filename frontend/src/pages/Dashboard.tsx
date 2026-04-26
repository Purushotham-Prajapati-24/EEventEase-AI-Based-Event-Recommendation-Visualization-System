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
import { Activity, TrendingUp, Calendar, Zap } from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { recommendations, isLoading } = useSelector((state: RootState) => state.recommendations);
  const { events } = useSelector((state: RootState) => state.events);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getRecommendations(user._id));
      dispatch(getEvents());
    }
  }, [user, navigate, dispatch]);

  // Data for Interest Radar
  const radarData = useMemo(() => {
    const userInterests = user?.interests || [];
    return userInterests.map(interest => {
      // Create a simple stable hash for "random" look without impurity
      const hash = interest.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return {
        subject: interest,
        A: (hash % 40) + 60, // Stable match score
        B: ((hash * 7) % 50) + 30, // Stable campus average
        fullMark: 100,
      };
    });
  }, [user]);

  // Data for Trending Bar Chart
  const trendingData = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    events.forEach(e => {
      e.tags.forEach(tag => {
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
            Welcome, <span className="text-gradient">{user.name}</span>!
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

      {/* Recommendations Feed */}
      <div className="space-y-6">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Zap className="h-7 w-7 text-primary animate-pulse" />
          AI <span className="text-primary">Spotlight</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-20 text-center">Loading AI magic...</div>
          ) : recommendations?.map((rec) => (
            <Card key={rec.event._id} className="glass border-primary/30 group hover:border-primary transition-all overflow-hidden shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20">
                    Match Score: {Math.floor(rec.score)}%
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{rec.event.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> {new Date(rec.event.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 italic">"{rec.reason}"</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full rounded-full bg-linear-to-r from-primary to-accent border-none shadow-md">
                  <Link to={`/events/${rec.event._id}`}>View Analysis</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
