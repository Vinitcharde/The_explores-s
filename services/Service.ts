
import { GoogleGenAI, Type } from "@google/genai";
import { TriageLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeTriage = async (symptoms: string, urgency: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following patient symptoms and self-reported urgency (1-10). 
                 Symptoms: ${symptoms}
                 Urgency: ${urgency}
                 
                 Provide a triage classification (CRITICAL, INTERMEDIATE, or NORMAL) and a triage score from 1-100 (higher means more urgent).
                 Be conservative and prioritize safety.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            level: {
              type: Type.STRING,
              description: "The triage level: CRITICAL, INTERMEDIATE, or NORMAL",
            },
            score: {
              type: Type.NUMBER,
              description: "A calculated triage score from 1 to 100",
            },
            justification: {
              type: Type.STRING,
              description: "A brief reason for the score",
            }
          },
          required: ["level", "score", "justification"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      level: (result.level as TriageLevel) || TriageLevel.NORMAL,
      score: result.score || 50,
      justification: result.justification || "Standard assessment"
    };
  } catch (error) {
    console.error("Triage analysis failed:", error);
    // Fallback logic
    if (urgency > 8) return { level: TriageLevel.CRITICAL, score: 90, justification: "High self-reported urgency (Fallback)" };
    if (urgency > 5) return { level: TriageLevel.INTERMEDIATE, score: 60, justification: "Moderate urgency (Fallback)" };
    return { level: TriageLevel.NORMAL, score: 30, justification: "Standard triage (Fallback)" };
  }
};
