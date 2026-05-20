import { Request, Response, NextFunction } from "express";
import Event from "../models/Event";
import User from "../models/User";
import { generateEventRecommendations } from "../services/aiService";

export const getPersonalizedRecommendations = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user._id.toString();
    const currentUserRole = req.user.role;

    // Enforce ownership check to prevent BOLA/IDOR
    if (currentUserId !== userId && currentUserRole !== "admin") {
      return res.status(403).json({ message: "Not authorized to access these recommendations" });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const upcomingEvents = await Event.find({ status: "upcoming" }).limit(15);
    
    const recommendations = await Promise.all(
      upcomingEvents.map(async (event) => {
        // Match Score (AI or Tag Fallback)
        const aiResult = await generateEventRecommendations(
          user.interests,
          event.tags,
          event.title,
          event.description,
          event.interests || []
        );
        
        // Popularity Score (Registrations / Capacity)
        const registrationCount = event.registeredAttendees.length;
        const capacity = event.capacity || 1; // Prevent division by zero
        const popularityScore = Math.min((registrationCount / capacity) * 100, 100);

        // Hybrid Score: 70% Match, 30% Popularity
        const finalScore = (aiResult.matchScore * 0.7) + (popularityScore * 0.3);

        // Dynamic Reason enhancement
        let reason = aiResult.explanation;
        if (popularityScore > 80 && aiResult.matchScore > 50) {
          reason = `🔥 Trending! ${reason}`;
        }
        return {
          event,
          score: finalScore,
          matchScore: aiResult.matchScore,
          popularityScore,
          reason,
          breakdown: aiResult.breakdown,
        };
      })
    );

    // Sort by final score descending
    recommendations.sort((a, b) => b.score - a.score);

    res.status(200).json(recommendations);
  } catch (error) {
    next(error);
  }
};