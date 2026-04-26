import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { getEvent } from "@/store/slices/eventsSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon } from "lucide-react";

export const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { event, isLoading, isError, message } = useSelector((state: RootState) => state.events);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getEvent(id));
    }
  }, [dispatch, id]);

  if (isLoading) return <div className="p-8 text-center">Loading event details...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error: {message}</div>;
  if (!event) return <div className="p-8 text-center">Event not found.</div>;

  const isRegistered = user && event.registeredAttendees?.includes(user._id);
  const isFull = event.registeredAttendees?.length >= event.capacity;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/discovery" className="flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Discovery
        </Link>
      </Button>

      <Card className="border-none shadow-lg overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center justify-center">
           <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">{event.title}</h1>
        </div>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl mt-4">Event Information</CardTitle>
            <div className="flex flex-wrap gap-2 mt-4">
               {event.tags.map(tag => (
                 <span key={tag} className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">{tag}</span>
               ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-muted p-4 rounded-lg min-w-[200px]">
             <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span>{new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}</span>
             </div>
             <div className="flex items-center gap-2 text-sm">
                <MapPinIcon className="w-4 h-4 text-primary" />
                <span>{event.location}</span>
             </div>
             <div className="flex items-center gap-2 text-sm">
                <UsersIcon className="w-4 h-4 text-primary" />
                <span>{event.registeredAttendees?.length || 0} / {event.capacity} Registered</span>
             </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">About This Event</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{event.description}</p>
          </div>
          
          <div className="pt-6 border-t flex justify-end">
            {!user ? (
               <Button asChild size="lg">
                 <Link to="/login">Login to Register</Link>
               </Button>
            ) : isRegistered ? (
               <Button variant="secondary" size="lg" disabled>
                 You are registered
               </Button>
            ) : isFull ? (
               <Button variant="destructive" size="lg" disabled>
                 Event is Full
               </Button>
            ) : (
               <Button size="lg" className="px-8">
                 Register Now
               </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
// <label>
