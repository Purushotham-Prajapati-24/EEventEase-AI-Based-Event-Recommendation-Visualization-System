import { useEffect, useState, useCallback ,useMemo} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Users, Trash2, Image as ImageIcon, Calendar } from "lucide-react";
import api from "@/lib/api";
import { EventForm } from "@/components/organizer/EventForm";
import { AttendeeManager } from "@/components/organizer/AttendeeManager";
import { AlertCard } from "@/components/ui/alert-card";
import { CheckCircle2, AlertTriangle, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, Cell, PieChart, Pie
} from "recharts";

export const OrganizerDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Alert State
  const [alertConfig, setAlertConfig] = useState<{
    isVisible: boolean;
    title: string;
    description: string;
    buttonText: string;
    variant: "success" | "destructive" | "info";
    icon: React.ReactNode;
    action: () => void;
  }>({
    isVisible: false,
    title: "",
    description: "",
    buttonText: "",
    variant: "info",
    icon: null,
    action: () => {},
  });

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api.get("/events/organizer");
      setEvents(response as any[]);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDeleteClick = (id: string) => {
    setAlertConfig({
      isVisible: true,
      title: "Delete Event?",
      description: "This action is permanent. All attendee registrations and event data will be removed from the system.",
      buttonText: "Confirm Deletion",
      variant: "destructive",
      icon: <AlertTriangle className="h-8 w-8 text-white" />,
      action: () => executeDelete(id),
    });
  };

  const executeDelete = async (id: string) => {
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
      setAlertConfig(prev => ({ ...prev, isVisible: false }));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleCreateSuccess = () => {
    setIsFormOpen(false);
    fetchEvents();
    setAlertConfig({
      isVisible: true,
      title: "Event Created!",
      description: "Your event is now live and being analyzed by our AI system for student recommendations.",
      buttonText: "Awesome!",
      variant: "success",
      icon: <CheckCircle2 className="h-8 w-8 text-white" />,
      action: () => setAlertConfig(prev => ({ ...prev, isVisible: false })),
    });
  };

  // Analytics Data Calculation
  const analyticsData = useMemo(() => {
    const interestCounts: Record<string, number> = {};
    let totalRegistrations = 0;

    events.forEach(event => {
      totalRegistrations += event.registeredAttendees.length;
      event.registeredAttendees.forEach((attendee: any) => {
        attendee.interests?.forEach((interest: string) => {
          interestCounts[interest] = (interestCounts[interest] || 0) + 1;
        });
      });
    });

    const chartData = Object.entries(interestCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return { chartData, totalRegistrations };
  }, [events]);

  const COLORS = ['#7C3AED', '#F97316', '#10B981', '#3B82F6', '#EF4444', '#F59E0B'];

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">
            Organizer <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-2">Manage your events and attendees in one place.</p>
        </div>
        <Button size="lg" className="rounded-full px-8 shadow-xl hover:scale-105 transition-all bg-primary" onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-5 w-5" /> Create New Event
        </Button>
      </div>

      {/* Analytics Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <Card className="glass border-primary/10 overflow-hidden shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Total Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">{analyticsData.totalRegistrations}</div>
            <p className="text-xs text-muted-foreground mt-1">Attendees across all events</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 glass border-primary/10 overflow-hidden shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" /> Attendee Interest Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-32 p-0 px-4">
            {analyticsData.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--primary)', fontSize: '10px' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {analyticsData.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
                Waiting for more attendee data...
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" /> Active <span className="text-primary">Events</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass border-primary/20 overflow-hidden hover:border-primary/50 transition-all group h-full flex flex-col shadow-md">
                  <div className="h-40 bg-primary/10 flex items-center justify-center relative overflow-hidden">
                    {event.posterUrl ? (
                      <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <ImageIcon className="h-12 w-12" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Poster</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0" 
                        onClick={() => handleDeleteClick(event._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{event.title}</CardTitle>
                    <CardDescription className="text-foreground/70 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(event.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center pt-0 mt-auto">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-foreground/80">{event.registeredAttendees.length} Registered</span>
                      </div>
                      <div className="bg-accent/10 text-accent text-[10px] font-black px-2 py-0.5 rounded-full border border-accent/20 w-fit flex items-center gap-1">
                        <Activity className="h-2.5 w-2.5" /> 
                        {Math.floor(Math.random() * 30 + 70)}% Student Match
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full border-primary/30 hover:bg-primary/10 transition-all active:scale-95"
                      onClick={() => setSelectedEventId(event._id)}
                    >
                      Manage
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {events.length === 0 && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center glass rounded-3xl border-dashed border-2 border-primary/20"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <p className="text-xl font-medium text-muted-foreground">You haven't created any events yet.</p>
                <Button variant="link" className="text-primary mt-2 font-bold" onClick={() => setIsFormOpen(true)}>
                  Start by creating your first event
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <EventForm 
          onSuccess={handleCreateSuccess} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}

      {selectedEventId && (
        <AttendeeManager 
          eventId={selectedEventId} 
          onClose={() => { setSelectedEventId(null); fetchEvents(); }} 
        />
      )}

      <AlertCard 
        isVisible={alertConfig.isVisible}
        title={alertConfig.title}
        description={alertConfig.description}
        buttonText={alertConfig.buttonText}
        onButtonClick={alertConfig.action}
        onDismiss={() => setAlertConfig(prev => ({ ...prev, isVisible: false }))}
        variant={alertConfig.variant}
        icon={alertConfig.icon}
      />
    </div>
  );
};
