import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import api from "@/lib/api";
import { uploadImage } from "@/lib/imagekit";
import { ImagePlus, Loader2 } from "lucide-react";

const INTEREST_OPTIONS = [
  "Coding", "Tech", "Dance", "Management", "Sports", "Music",
  "Art", "Design", "Business", "Networking", "Literature", "Gaming",
  "Photography", "Film", "Science", "Robotics", "Finance", "Debate"
];

const Onboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile setup state
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSkipAll = async () => {
    if (!user) return;
    try {
      await api.put(`/users/${user._id}`, { interests: [] });
      dispatch(setUser({ ...user, interests: [] } as any));
      navigate("/dashboard");
    } catch {
      navigate("/dashboard");
    }
  };

  const handleInterestsNext = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await api.put(`/users/${user._id}`, { interests: selected });
      dispatch(setUser({ ...user, interests: selected } as any));
      setStep(2);
    } catch (error) {
      console.error("Failed to save interests:", error);
      setStep(2); // Continue anyway
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      setProfileImage(url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const updated = await api.put(`/users/${user._id}`, { name, bio, profileImage });
      dispatch(setUser({ ...user, ...updated } as any));
      navigate(`/profile/${user._id}`);
    } catch (error) {
      console.error("Failed to save profile:", error);
      navigate("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[48px] p-12 max-w-2xl w-full border-primary/20 shadow-2xl space-y-10 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-secondary/10 rounded-full blur-3xl" />

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 relative z-10">
          <div className={`h-2 rounded-full transition-all ${step === 1 ? "w-16 bg-primary" : "w-8 bg-primary/40"}`} />
          <div className={`h-2 rounded-full transition-all ${step === 2 ? "w-16 bg-primary" : "w-8 bg-primary/20"}`} />
        </div>

        {step === 1 && (
          <div className="space-y-10 relative z-10">
            <div className="text-center space-y-4">
              <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-4xl font-black tracking-tighter">What are you into?</h2>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed px-8">
                Pick your interests so we can match you with the right events and people.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {INTEREST_OPTIONS.map((interest) => (
                <motion.button
                  key={interest}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleInterest(interest)}
                  className={`px-6 py-3 rounded-full text-sm font-black transition-all border-2 flex items-center gap-2 ${
                    selected.includes(interest)
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-background/50 border-primary/10 hover:border-primary/30"
                  }`}
                >
                  {selected.includes(interest) && <Check className="h-3.5 w-3.5" />}
                  {interest}
                </motion.button>
              ))}
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleInterestsNext}
                disabled={selected.length === 0 || isSubmitting}
                className="w-full h-14 rounded-3xl text-base font-black tracking-tighter shadow-xl shadow-primary/20"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <span className="flex items-center gap-2">Continue <ArrowRight className="h-5 w-5" /></span>
                )}
              </Button>
              <button
                onClick={handleSkipAll}
                className="w-full text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 relative z-10">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tighter">Set Up Your Profile</h2>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Add a photo and bio so others can connect with you. You can always do this later.
              </p>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group h-32 w-32 rounded-[32px] overflow-hidden border-4 border-primary/20 bg-slate-800 cursor-pointer">
                <img
                  src={profileImage || `https://i.pravatar.cc/150?u=${user?._id}`}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                  {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : <ImagePlus className="h-6 w-6 text-white" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-white mt-1">Upload</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>
            </div>

            {/* Name & Bio */}
            <div className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Display Name"
                className="w-full rounded-2xl border border-primary/20 bg-primary/5 px-4 h-12 text-sm font-bold focus:border-primary focus:outline-none transition-all"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio..."
                className="w-full min-h-[80px] rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm font-medium focus:border-primary focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleProfileSubmit}
                disabled={isSubmitting || isUploading}
                className="w-full h-14 rounded-3xl text-base font-black tracking-tighter shadow-xl shadow-primary/20"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <span className="flex items-center gap-2">Complete Profile <Check className="h-5 w-5" /></span>
                )}
              </Button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Onboarding;
