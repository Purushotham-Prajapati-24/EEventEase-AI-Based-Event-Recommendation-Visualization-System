import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Users, Trash2, Image as ImageIcon } from "lucide-react";
import api from "@/lib/api";
import { EventForm } from "@/components/organizer/EventForm";
import { AttendeeManager } from "@/components/organizer/AttendeeManager";
import { AlertCard } from "@/components/ui/alert-card";
import { CheckCircle2, AlertTriangle } from "lucide-react";

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event._id} className="glass border-primary/20 overflow-hidden hover:border-primary/50 transition-all group">
            <div className="h-40 bg-primary/10 flex items-center justify-center relative">
              {event.posterUrl ? (
                <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="h-12 w-12 text-primary/30" />
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-lg" onClick={() => handleDeleteClick(event._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
              <CardDescription className="text-foreground/70">{new Date(event.date).toLocaleDateString()} • {event.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center pt-0">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-foreground/80">{event.registeredAttendees.length} Registered</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full border-primary/30 hover:bg-primary/10"
                onClick={() => setSelectedEventId(event._id)}
              >
                Manage Users
              </Button>
            </CardContent>
          </Card>
        ))}

        {events.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-2 border-primary/20">
            <p className="text-xl font-medium text-muted-foreground">You haven't created any events yet.</p>
            <Button variant="link" className="text-primary mt-2" onClick={() => setIsFormOpen(true)}>Start by creating your first event</Button>
          </div>
        )}
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
