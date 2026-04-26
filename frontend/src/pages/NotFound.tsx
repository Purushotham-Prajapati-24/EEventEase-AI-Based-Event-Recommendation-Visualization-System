import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import FuzzyText from "@/components/ui/fuzzy-text";
import { DotPattern } from "@/components/ui/dot-pattern-1";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-8 text-center">
      {/* Texture Background */}
      <DotPattern className="opacity-20" width={12} height={12} />
      
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative group">
          <FuzzyText 
            baseIntensity={0.2} 
            hoverIntensity={0.6} 
            enableHover={true}
            glitchMode={true}
            glitchInterval={1500}
            gradient={["#10b981", "#f59e0b", "#f43f5e"]}
            fontSize="clamp(6rem, 20vw, 16rem)"
          >
            404
          </FuzzyText>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-linear-to-r from-transparent via-primary to-transparent blur-md opacity-50" />
        </div>

        <div className="space-y-4 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Lost in the <span className="text-gradient">Digital Campus?</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            We couldn't find the event you were looking for. It might have been rescheduled or moved to a different dimension.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <Button asChild size="lg" className="rounded-full px-8 h-14 text-md font-bold shadow-2xl hover:scale-105 transition-all bg-primary">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" /> Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 text-md font-bold border-primary/20 hover:bg-primary/5">
            <button onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-5 w-5" /> Go Back
            </button>
          </Button>
        </div>
      </div>
      
      {/* Technical Footer */}
      <div className="absolute bottom-8 text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground/30 flex items-center gap-4">
        <span>Error Code: ERR_EVENT_NOT_FOUND</span>
        <div className="h-1 w-1 rounded-full bg-primary/30" />
        <span>Status: Glitch Protocol Active</span>
      </div>
    </div>
  );
};
