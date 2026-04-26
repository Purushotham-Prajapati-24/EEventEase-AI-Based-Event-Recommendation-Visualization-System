import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Target, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { setUser } from "../store/slices/authSlice";
import api from "../lib/api";

const INTEREST_OPTIONS = [
  "Coding", "Tech", "Dance", "Management", "Sports", "Music", 
  "Art", "Design", "Business", "Networking", "Literature", "Gaming"
];

export const OnboardingInterests = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const toggleInterest = (interest: string) => {
    setSelected(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const response = await api.put(`/users/${user._id}`, { interests: selected });
      dispatch(setUser({ ...user, interests: selected }));
    } catch (error) {
      console.error("Failed to save interests:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
    >
      <div className="glass rounded-[48px] p-12 max-w-xl w-full border-primary/20 shadow-2xl space-y-10 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-secondary/10 rounded-full blur-3xl" />

        <div className="text-center space-y-6 relative z-10">
          <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Target className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tighter">Personalize Your Feed</h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed px-8">
              Select interests to get AI-powered event recommendations tailored specifically for you.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 relative z-10">
          {INTEREST_OPTIONS.map((interest) => (
            <motion.button
              key={interest}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleInterest(interest)}
              className={`px-8 py-4 rounded-full text-sm font-black transition-all border-2 flex items-center gap-2 ${
                selected.includes(interest)
                  ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-background/50 border-primary/10 hover:border-primary/30"
              }`}
            >
              {selected.includes(interest) && <Check className="h-4 w-4" />}
              {interest}
            </motion.button>
          ))}
        </div>

        <div className="pt-6 space-y-6 relative z-10">
          <Button 
            onClick={handleSubmit}
            disabled={selected.length === 0 || isSubmitting}
            className="w-full h-16 rounded-3xl text-lg font-black tracking-tighter shadow-2xl shadow-primary/20 group"
          >
            {isSubmitting ? "Syncing..." : "Get Recommendations"}
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <button 
            onClick={() => dispatch(setUser({ ...user!, interests: [] }))}
            className="w-full text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </motion.div>
  );
};
