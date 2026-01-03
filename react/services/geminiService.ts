import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const summarizePost = async (content: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize this social media post in one short, punchy sentence: "${content}"`,
    });
    return response.text || "Could not summarize.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to summarize.";
  }
};

export const generatePostDraft = async (topic: string, tone: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const prompt = `Create a clean, modern social-media post about: "${topic}".
    Tone: ${tone}.
    Use 1-2 emojis tastefully.
    Keep it under 280 characters if possible, but prioritize clarity.
    Do not add hashtags.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating content.";
  }
};