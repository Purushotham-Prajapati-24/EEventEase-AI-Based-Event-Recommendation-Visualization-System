import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImagePlus, X, Calendar, MapPin, Users as UsersIcon, FileText } from "lucide-react";
import api from "@/lib/api";
import { uploadImage } from "@/lib/imagekit";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(3, "Venue/Location is required"),
  club: z.string().min(2, "Club name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
});

interface EventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const EventForm = ({ onSuccess, onCancel }: EventFormProps) => {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      club: "",
      capacity: 50,
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await api.post("/events", { ...values, posterUrl });
      onSuccess();
    } catch (err: any) {
      console.error("Failed to create event", err);
      setError(err.message || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        setError(null);
        const url = await uploadImage(file);
        setPosterUrl(url);
      } catch (err: any) {
        setError("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl glass border-primary/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <CardTitle className="text-2xl font-black flex justify-between items-center">
            Create <span className="text-primary">New Event</span>
            <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Poster Upload Zone */}
              <div className="group relative h-48 w-full rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/50">
                {posterUrl ? (
                  <>
                    <img src={posterUrl} alt="Preview" className="h-full w-full object-cover" />
                    <Button 
                      type="button"
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                      onClick={() => setPosterUrl(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all">
                      <ImagePlus className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm font-medium">Upload Event Poster</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WEBP (Max 5MB)</p>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. AI Hackathon 2025" className="rounded-xl border-primary/20 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="club"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><UsersIcon className="h-4 w-4 text-primary" /> Organizing Club</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Tech Society" className="rounded-xl border-primary/20 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">Date & Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" className="rounded-xl border-primary/20 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Venue</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Main Auditorium" className="rounded-xl border-primary/20 focus-visible:ring-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><UsersIcon className="h-4 w-4 text-primary" /> Max Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          className="rounded-xl border-primary/20 focus-visible:ring-primary" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Description</FormLabel>
                    <FormControl>
                      <textarea 
                        className="flex min-h-[100px] w-full rounded-xl border border-primary/20 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                        placeholder="Describe your event details..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in slide-in-from-top-2 duration-300">
                  {error}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-primary/10">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SSL Secure Submission
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={onCancel} className="rounded-full">Cancel</Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isUploading}
                    className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white shadow-xl min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Creating...
                      </span>
                    ) : "Create Event"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
