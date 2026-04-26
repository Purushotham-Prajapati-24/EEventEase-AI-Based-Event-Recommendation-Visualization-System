import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Zap, Target, TrendingUp, Sparkles } from "lucide-react";
import gsap from "gsap";

import { DotPattern } from "@/components/ui/dot-pattern-1";

export const Home = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
        clearProps: "all",
      });

      gsap.from(".hero-feature", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.8,
        clearProps: "all",
      });

      // Vision Reveal
      gsap.from(".vision-line", {
        scrollTrigger: {
          trigger: visionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: "power4.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen bg-background overflow-hidden relative">
      {/* Clean White Background */}
      <div className="absolute inset-0 z-0 bg-background" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 flex flex-col items-center text-center z-10 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Simplified Background */}
          
          <div className="max-w-4xl space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black uppercase tracking-widest animate-bounce">
              <Sparkles className="h-4 w-4" /> AI-Powered Event Recommendations
            </div>
            
            <h1 ref={titleRef} className="text-7xl md:text-9xl font-black tracking-tighter leading-tight text-foreground">
              Discover the Future <br />
              with <span className="text-gradient">Event Ease</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto hero-feature">
              The ultimate campus event ecosystem. Personalized for you, managed by AI, and designed for the next generation of students.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              {user ? (
                <Button asChild size="lg" className="rounded-full px-12 h-16 text-lg font-bold shadow-2xl hover:scale-105 transition-all bg-primary">
                  <Link to="/discovery">Go to Discovery</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="rounded-full px-12 h-16 text-lg font-bold shadow-2xl hover:scale-105 transition-all bg-primary">
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full px-12 h-16 text-lg font-bold border-primary/20 hover:text-primary">
                    <Link to="/login">Login</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Bento Grid Showcase */}
      <section className="container mx-auto px-8 py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Hero Feature: AI Interest Matching */}
          <div className="hero-feature md:col-span-2 glass rounded-[40px] border-primary/20 overflow-hidden group relative min-h-[300px] p-10">
            <div className="relative z-10 h-full flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 backdrop-blur-xl flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">Precision <br /> Interest Matching</h3>
                <p className="text-base text-muted-foreground font-medium max-w-sm">
                  Predicting events you'll love with <span className="text-primary font-black">98% accuracy</span>.
                </p>
              </div>

              {/* Live Match Meter Mockup */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <div className="text-center">
                  <span className="text-3xl font-black text-primary">98%</span>
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Match Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Analytics */}
          <div className="hero-feature glass rounded-[40px] border-secondary/20 overflow-hidden group relative p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary/20 backdrop-blur-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter">Campus Pulse</h3>
            </div>

            {/* Simulated Sparkline */}
            <div className="h-24 w-full flex items-end gap-1 px-2">
              {[40, 70, 45, 90, 65, 80, 50, 95, 75, 85].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-secondary/40 rounded-t-sm"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                />
              ))}
            </div>

            <p className="text-sm text-muted-foreground font-medium mt-4">
              Real-time heatmaps showing what's hot on campus right now.
            </p>
          </div>

          {/* AI Recommendations */}
          <div className="hero-feature glass rounded-[40px] border-accent/20 p-10 flex flex-col justify-between group hover:border-accent transition-all">
            <div className="h-12 w-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent group-hover:animate-bounce">
              <Zap className="h-6 w-6" />
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="h-2 w-12 bg-accent/30 rounded-full animate-pulse" />
                <div className="h-2 w-8 bg-accent/10 rounded-full" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter">Smart Feed</h3>
              <p className="text-sm text-muted-foreground font-medium">
                Personalized explanations powered by local LLMs.
              </p>
            </div>
          </div>

          {/* Community Pulse */}
          <div className="hero-feature glass rounded-[40px] border-primary/20 p-10 md:col-span-2 flex flex-col md:flex-row items-center justify-between group overflow-hidden relative">
            <div className="relative z-10 space-y-2 text-center md:text-left">
              <h3 className="text-3xl font-black tracking-tighter italic text-gradient">Join 5000+ Students</h3>
              <p className="text-muted-foreground font-medium">The largest event community at VNR Vignana Jyothi.</p>
            </div>
            <div className="relative z-10 flex -space-x-4 mt-6 md:mt-0">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-14 w-14 rounded-full border-4 border-background bg-slate-800 flex items-center justify-center overflow-hidden hover:-translate-y-2 transition-transform cursor-pointer shadow-xl">
                  <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" />
                </div>
              ))}
              <div className="h-14 w-14 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground font-black text-xs shadow-xl">
                +1k
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Visionary Quote Section */}
      <section ref={visionRef} className="mx-auto mb-20 max-w-7xl px-8">
        <div className="relative flex flex-col items-center border border-primary/20 rounded-[40px] overflow-hidden group hover:border-primary/50 transition-colors">
          <DotPattern width={8} height={8} className="opacity-20" />

          {/* Corner Highlights */}
          <div className="absolute -left-1.5 -top-1.5 h-4 w-4 bg-primary shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20" />
          <div className="absolute -bottom-1.5 -left-1.5 h-4 w-4 bg-primary shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20" />
          <div className="absolute -right-1.5 -top-1.5 h-4 w-4 bg-primary shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20" />
          <div className="absolute -bottom-1.5 -right-1.5 h-4 w-4 bg-primary shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20" />

          <div className="relative z-20 mx-auto max-w-7xl py-12 md:p-16 text-center">
            <p className="text-primary font-black uppercase tracking-[0.3em] mb-6 text-xs animate-pulse">
              Our Philosophy
            </p>
            <div className="text-3xl md:text-5xl lg:text-7xl tracking-tighter leading-none flex flex-col gap-2">
              <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 vision-line">
                <p className="font-thin text-muted-foreground">Your</p>
                <h2 className="font-black">interests</h2>
                <p className="font-thin text-muted-foreground">aren't</p>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 vision-line">
                <h2 className="font-black">random—</h2>
                <p className="font-thin text-muted-foreground">see</p>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 vision-line">
                <p className="font-thin text-muted-foreground">where they</p>
                <h2 className="font-black">come</h2>
              </div>
              <h2 className="font-black text-gradient text-5xl md:text-7xl lg:text-8xl vision-line">alive"</h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
