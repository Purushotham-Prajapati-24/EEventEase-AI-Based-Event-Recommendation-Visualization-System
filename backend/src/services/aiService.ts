import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const primaryGroq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const fallbackGroq = new Groq({
  apiKey: process.env.GROQ_FALLBACK_API_KEY || "",
});

let currentGroq = process.env.GROQ_API_KEY ? primaryGroq : fallbackGroq;

export const generateEventRecommendations = async (
  userInterests: string[],
  eventTags: string[],
  eventTitle: string,
  eventDescription: string,
  eventInterests: string[] = []
) => {
  try {
    const prompt = `
      You are an expert student life coordinator at a university.
      Evaluate the relevance of the following event for a student with the listed interests.
      
      User Interests: ${userInterests.join(", ")}
      Event Title: ${eventTitle}
      Event Tags: ${eventTags.join(", ")}
      Event Focus Interests: ${eventInterests.join(", ")}
      Event Description: ${eventDescription}
      
      Analysis Criteria:
      1. Topic Relevance: How well do the event's defined interests and tags overlap with user interests?
      2. Skill Alignment: Does the event offer growth relevant to their professional/personal interests?
      3. Community Fit: Is this a high-value activity for someone with their hobbies?

      Provide your analysis in strictly valid JSON format with:
      - "matchScore": an integer from 0 to 100 representing the total relevance.
      - "explanation": A detailed, personalized verdict (2-3 sentences) explaining EXACTLY why this event is perfect for the user based on their specific interests. Also, analyze the event description and explicitly mention key highlights like prize money, special guests, or exclusive opportunities if they exist.
      - "breakdown": an object with "topic", "skill", and "community" scores (0-100 each).
      
      Return ONLY raw JSON. No markdown.
    `;

    const requestConfig = {
      messages: [
        {
          role: "user" as const,
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      response_format: { type: "json_object" as const },
    };

    let chatCompletion;
    try {
      chatCompletion = await currentGroq.chat.completions.create(requestConfig);
    } catch (apiError: any) {
      if (apiError?.status === 429) {
        console.warn("Rate limit reached on current Groq API key. Switching keys...");
        currentGroq = currentGroq === primaryGroq ? fallbackGroq : primaryGroq;
        chatCompletion = await currentGroq.chat.completions.create(requestConfig);
      } else {
        throw apiError;
      }
    }

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(responseContent);

    return {
      matchScore: result.matchScore || 0,
      explanation: result.explanation || "No explanation provided.",
      breakdown: result.breakdown || { topic: 0, skill: 0, community: 0 }
    };
  } catch (error) {
    console.error("Error generating recommendations:", error);
    // Fallback to basic match if AI completely fails
    const matched = userInterests.filter(i => eventTags.includes(i)).length;
    const score = userInterests.length ? Math.round((matched / userInterests.length) * 100) : 0;
    return {
      matchScore: score,
      explanation: `Matched ${matched} of your interests. (AI temporarily unavailable)`,
      breakdown: { topic: 0, skill: 0, community: 0 }
    };
  }
};
