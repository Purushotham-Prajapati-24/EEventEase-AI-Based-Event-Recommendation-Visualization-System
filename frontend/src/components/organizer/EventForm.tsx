import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImagePlus, X, Calendar, MapPin, Users as UsersIcon, FileText, Link as LinkIcon, Upload, Trophy, CheckCircle2, AlertTriangle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { uploadImage } from "@/lib/imagekit";

const INTEREST_OPTIONS = [
  "Coding", "Tech", "Dance", "Management", "Sports", "Music",
  "Art", "Design", "Business", "Networking", "Literature", "Gaming",
  "Photography", "Film", "Science", "Robotics", "Finance", "Debate"
];

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(3, "Venue/Location is required"),
  club: z.string().min(2, "Club name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
});

interface EventFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const EventForm = ({ onSuccess, onCancel }: EventFormProps) => {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [bannerType, setBannerType] = useState<"upload" | "url">("upload");
  const [bannerUrlInput, setBannerUrlInput] = useState("");
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
      interests: [],
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      // Use URL input directly if banner type is URL
      const finalPosterUrl = bannerType === "url" ? bannerUrlInput || null : posterUrl;
      await api.post("/events", { ...values, posterUrl: finalPosterUrl });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4 overflow-hidden">
      <Card className="w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col glass border-primary/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 rounded-none sm:rounded-3xl">
        <CardHeader className="bg-primary/5 border-b border-primary/10 shrink-0 p-6">
          <CardTitle className="text-2xl font-black flex justify-between items-center">
            Create <span className="text-primary">New Event</span>
            <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full hover:bg-primary/10">
              <X className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-col flex-1 overflow-hidden bg-background/50 relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {/* Banner Type Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/70">
                      <ImagePlus className="h-4 w-4" /> Event Banner
                    </FormLabel>
                    <div className="flex items-center gap-1 p-1 rounded-full bg-primary/5 border border-primary/10">
                      <button
                        type="button"
                        onClick={() => { setBannerType("upload"); setBannerUrlInput(""); }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${bannerType === "upload" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => { setBannerType("url"); setPosterUrl(null); }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${bannerType === "url" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        URL
                      </button>
                    </div>
                  </div>

                  {bannerType === "upload" ? (
                    <div className="group relative h-40 w-full rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/50 hover:bg-primary/10">
                      {posterUrl ? (
                        <>
                          <img src={posterUrl} alt="Preview" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button type="button" variant="destructive" size="icon" className="h-10 w-10 rounded-full shadow-xl" onClick={() => setPosterUrl(null)}>
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer space-y-2 w-full h-full">
                          <div className="p-3 rounded-full bg-primary/10 group-hover:scale-110 transition-transform">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold">Select Poster Image</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">JPG, PNG or WebP</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                          <span className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></span>
                          <span className="text-[10px] font-black uppercase tracking-tighter">Uploading...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
                        <input
                          type="url"
                          value={bannerUrlInput}
                          onChange={(e) => setBannerUrlInput(e.target.value)}
                          placeholder="Paste image URL here..."
                          className="w-full rounded-2xl border border-primary/20 bg-primary/5 pl-11 pr-4 py-3 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                      </div>
                      {bannerUrlInput && (
                        <div className="h-32 w-full rounded-2xl overflow-hidden border border-primary/10 shadow-inner bg-primary/5 flex items-center justify-center relative">
                          <span className="text-xs text-muted-foreground absolute z-0 font-medium">Invalid or broken image URL</span>
                          <img 
                            key={bannerUrlInput}
                            src={bannerUrlInput} 
                            alt="URL Preview" 
                            className="h-full w-full object-cover relative z-10" 
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} 
                          />
                        </div>
                      )}
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
                  </FormItem>
                )}
              />

                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/70">
                        <Trophy className="h-4 w-4" /> Target Interests (AI Matching)
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {/* Dropdown-style Selection */}
                          <div className="relative group">
                            <select
                              className="w-full appearance-none rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer"
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val && !field.value.includes(val)) {
                                  field.onChange([...field.value, val]);
                                }
                                e.target.value = ""; // Reset
                              }}
                            >
                              <option value="" disabled selected>Select an interest...</option>
                              {INTEREST_OPTIONS.filter(opt => !field.value.includes(opt)).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                              <Plus className="h-4 w-4" />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 p-4 min-h-[64px] rounded-2xl border border-primary/10 bg-primary/5 shadow-inner">
                            <AnimatePresence>
                              {field.value?.length > 0 ? (
                                field.value.map((interest: string) => (
                                  <motion.span 
                                    key={interest}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                                  >
                                    {interest}
                                    <button 
                                      type="button" 
                                      onClick={() => field.onChange(field.value.filter((i: string) => i !== interest))}
                                      className="hover:scale-125 transition-transform"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </motion.span>
                                ))
                              ) : (
                                <span className="text-muted-foreground/50 text-sm italic py-1">Choose topics that describe your event...</span>
                              )}
                            </AnimatePresence>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {INTEREST_OPTIONS.slice(0, 8).map((interest) => {
                              const isSelected = field.value?.includes(interest);
                              return (
                                <button
                                  key={interest}
                                  type="button"
                                  onClick={() => {
                                    const current = field.value || [];
                                    const updated = isSelected
                                      ? current.filter((i: string) => i !== interest)
                                      : [...current, interest];
                                    field.onChange(updated);
                                  }}
                                  className={`px-3 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex flex-col items-center justify-center gap-2 border ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-95"
                                      : "bg-primary/5 text-muted-foreground border-primary/5 hover:bg-primary/10 hover:border-primary/20"
                                  }`}
                                >
                                  {interest}
                                  {isSelected && <CheckCircle2 className="h-3 w-3" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-6 bg-primary/5 border-t border-primary/10 shrink-0 backdrop-blur-md">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-3"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-60">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    AI Optimized Submission
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto">
                    <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 sm:flex-none rounded-full h-12 px-8 font-bold hover:bg-primary/10 transition-all">Cancel</Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || isUploading}
                      className="flex-1 sm:flex-none rounded-full h-12 px-10 bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-3">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                          Processing
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Create Event <Trophy className="h-4 w-4 ml-2" />
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
          </form>
        </Form>
      </CardContent>
      </Card>
    </div>
  );
};
