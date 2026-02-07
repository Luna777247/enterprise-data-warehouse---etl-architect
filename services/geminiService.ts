
import { GoogleGenAI } from "@google/genai";

// Standardize Gemini API call following modern @google/genai guidelines
export const askDataArchitect = async (prompt: string) => {
  try {
    // Always use direct process.env.API_KEY in the constructor and avoid local fallback logic
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a world-class Data Architect. Answer the following technical question about Data Warehousing, ETL, dbt, or Star Schema architecture:\n\n${prompt}`,
      config: {
        temperature: 0.7,
        topP: 0.95,
        // Removed maxOutputTokens to follow guidelines suggesting avoiding it unless setting thinkingBudget explicitly
      }
    });

    // Access the .text property directly instead of calling a method or nested structures
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to the AI Architect. Please try again later.";
  }
};
