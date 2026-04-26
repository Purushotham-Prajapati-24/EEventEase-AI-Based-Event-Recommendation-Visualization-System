import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Zap, Target, TrendingUp, Sparkles } from "lucide-react";
import gsap from "gsap";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { GooeyFilter } from "@/components/ui/gooey-filter";
import { DotPattern } from "@/components/ui/dot-pattern-1";
import { useScreenSize } from "@/hooks/use-screen-size";

export const Home = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const screenSize = useScreenSize();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });

      gsap.from(".hero-feature", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.8,
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
      {/* Cinematic Gooey Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
        <GooeyFilter id="gooey-filter-pixel-trail" strength={screenSize.lessThan('md') ? 2 : 4} />
        <div
          className="absolute inset-0"
          style={{ filter: "url(#gooey-filter-pixel-trail)" }}
        >
          <PixelTrail
            pixelSize={screenSize.lessThan('md') ? 24 : 36}
            fadeDuration={1000}
            delay={0}
            pixelClassName="bg-black dark:bg-primary"
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 flex flex-col items-center text-center z-10 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Background Gradients */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
          
          <div className="max-w-4xl space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black uppercase tracking-widest animate-bounce">
              <Sparkles className="h-4 w-4" /> AI-Powered Event Recommendations
            </div>
            
            <h1 ref={titleRef} className="text-7xl md:text-9xl font-black tracking-tighter leading-tight">
              Discover the Future <br />
              with <span className="text-gradient">Event Ease</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
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
          <div className="hero-feature md:col-span-2 glass rounded-[40px] border-primary/20 overflow-hidden group relative min-h-[500px]">
            <img 
              src="/ai_match_engine_visual_1777199429232.png" 
              alt="Interest Match Visual" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
            
            <div className="relative z-10 p-12 h-full flex flex-col justify-end">
              <div className="h-16 w-16 rounded-3xl bg-primary/20 backdrop-blur-xl flex items-center justify-center text-primary mb-6 group-hover:rotate-12 transition-transform">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-5xl font-black tracking-tighter mb-4">Precision <br /> Interest Matching</h3>
              <p className="text-xl text-muted-foreground font-medium max-w-md">
                Our engine analyzes your campus activity to predict events you'll love with 98% accuracy.
              </p>
            </div>
          </div>

          {/* Trending Analytics */}
          <div className="hero-feature glass rounded-[40px] border-secondary/20 overflow-hidden group relative">
            <img 
              src="/trending_heatmap_visual_1777199458259.png" 
              alt="Trending Heatmap" 
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
            
            <div className="relative z-10 p-10 h-full flex flex-col justify-end">
              <div className="h-14 w-14 rounded-2xl bg-secondary/20 backdrop-blur-xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-black tracking-tighter mb-2">Trending Analytics</h3>
              <p className="text-muted-foreground font-medium">
                Real-time heatmaps showing what's hot on campus right now.
              </p>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="hero-feature glass rounded-[40px] border-accent/20 p-10 flex flex-col justify-between group hover:border-accent transition-all min-h-[300px]">
            <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent group-hover:animate-bounce">
              <Zap className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tighter mb-2">Smart Feed</h3>
              <p className="text-muted-foreground font-medium">
                Personalized explanations for every suggestion we make, powered by local LLMs.
              </p>
            </div>
          </div>

          {/* Community Pulse - Extra Card to fill space */}
          <div className="hero-feature glass rounded-[40px] border-primary/20 p-10 md:col-span-2 flex items-center justify-between group overflow-hidden relative">
            <div className="relative z-10 space-y-2">
              <h3 className="text-3xl font-black tracking-tighter italic text-gradient">Join 5000+ Students</h3>
              <p className="text-muted-foreground font-medium">The largest event community at VNR Vignana Jyothi.</p>
            </div>
            <div className="relative z-10 flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-12 rounded-full border-4 border-background bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                </div>
              ))}
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

          <div className="relative z-20 mx-auto max-w-7xl py-16 md:p-20 text-center">
            <p className="text-primary font-black uppercase tracking-[0.3em] mb-8 text-sm animate-pulse">
              Our Philosophy
            </p>
            <div className="text-4xl md:text-6xl lg:text-8xl tracking-tighter leading-none flex flex-col gap-2">
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
              <h2 className="font-black text-gradient text-6xl md:text-8xl lg:text-9xl vision-line">alive"</h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
