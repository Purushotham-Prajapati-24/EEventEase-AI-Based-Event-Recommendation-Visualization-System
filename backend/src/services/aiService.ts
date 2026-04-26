import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export const generateEventRecommendations = async (
  userInterests: string[],
  eventTags: string[],
  eventTitle: string,
  eventDescription: string
) => {
  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY is not set. Falling back to basic match.");
    // Basic fallback algorithm as defined in the plan:
    // (Matched Tags / Total Interests) * 100
    const matched = userInterests.filter(i => eventTags.includes(i)).length;
    const score = userInterests.length ? Math.round((matched / userInterests.length) * 100) : 0;
    return {
      matchScore: score,
      explanation: `Matched ${matched} of your interests.`,
    };
  }

  try {
    const prompt = `
      You are an AI assistant for a college event recommendation platform called EventEase.
      Evaluate how well the following event matches the user's interests.
      
      User Interests: ${userInterests.join(", ")}
      Event Title: ${eventTitle}
      Event Tags: ${eventTags.join(", ")}
      Event Description: ${eventDescription}
      
      Provide your analysis in strictly valid JSON format with two fields:
      - "matchScore": an integer from 0 to 100 representing the relevance.
      - "explanation": a short 1-2 sentence explanation of why this event matches or doesn't match their interests.
      
      Do NOT wrap the JSON in Markdown formatting like \`\`\`json. Return only the raw JSON.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192", // Fast and efficient for quick inferences
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(responseContent);

    return {
      matchScore: result.matchScore || 0,
      explanation: result.explanation || "No explanation provided.",
    };
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return {
      matchScore: 0,
      explanation: "Failed to generate AI recommendation.",
    };
  }
};
