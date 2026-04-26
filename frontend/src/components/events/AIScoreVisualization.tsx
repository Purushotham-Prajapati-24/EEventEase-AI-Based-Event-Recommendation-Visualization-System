import React from "react";
import { Brain, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AIScoreVisualizationProps {
  matchScore: number;
  popularityScore: number;
  overallScore: number;
  reason: string;
  breakdown?: {
    topic: number;
    skill: number;
    community: number;
  };
}

export const AIScoreVisualization = ({
  matchScore,
  popularityScore,
  overallScore,
  reason,
  breakdown
}: AIScoreVisualizationProps) => {
  return (
    <div className="space-y-8 p-10 bg-white rounded-[40px] border border-border shadow-xl shadow-slate-200/50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest text-foreground leading-none">AI Insight Engine</h3>
            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tight">Personalized Student Interest Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-foreground text-white rounded-2xl shadow-lg shadow-slate-200">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-lg font-black italic tracking-tighter">{Math.round(overallScore)}% Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        {/* Match Score */}
        <div className="space-y-6 group">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Interest Match</span>
            </div>
            <span className="text-2xl font-black italic text-primary">{Math.round(matchScore)}%</span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${matchScore}%` }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          
          {/* Detailed Breakdown Chips */}
          {breakdown && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Topic", val: breakdown.topic, color: "bg-primary/10 text-primary" },
                { label: "Skill", val: breakdown.skill, color: "bg-accent/10 text-accent" },
                { label: "Vibe", val: breakdown.community, color: "bg-secondary/10 text-secondary" }
              ].map(item => (
                <div key={item.label} className={`flex flex-col items-center justify-center p-2 rounded-xl ${item.color} border border-current/10`}>
                  <span className="text-[8px] font-black uppercase tracking-tighter opacity-70">{item.label}</span>
                  <span className="text-xs font-black italic">{item.val}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popularity Score */}
        <div className="space-y-6 group">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-secondary" />
              <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Campus Pulse</span>
            </div>
            <span className="text-2xl font-black italic text-secondary">{Math.round(popularityScore)}%</span>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${popularityScore}%` }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
              className="h-full bg-secondary rounded-full"
            />
          </div>
          <p className="text-[11px] text-muted-foreground font-bold italic leading-tight group-hover:text-foreground transition-colors">
            Trending significantly among users with similar academic background and interests.
          </p>
        </div>
      </div>

      <div className="pt-8 border-t-2 border-slate-50 mt-4 relative z-10">
        <div className="flex items-start gap-5">
          <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shrink-0 shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">The AI Verdict</p>
            <p className="text-base font-bold text-foreground leading-snug italic tracking-tight">
              "{reason}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
