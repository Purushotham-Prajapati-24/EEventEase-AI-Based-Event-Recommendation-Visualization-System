import { Request, Response } from "express";
import Event from "../models/Event";
import User from "../models/User";
import { generateEventRecommendations } from "../services/aiService";

export const getPersonalizedRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const upcomingEvents = await Event.find({ status: "upcoming" }).limit(10);
    
    const recommendations = await Promise.all(
      upcomingEvents.map(async (event) => {
        const aiResult = await generateEventRecommendations(
          user.interests,
          event.tags,
          event.title,
          event.description
        );
        
        return {
          event,
          score: aiResult.matchScore,
          reason: aiResult.explanation,
        };
      })
    );

    // Sort by score descending
    recommendations.sort((a, b) => b.score - a.score);

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate recommendations", error });
  }
};
