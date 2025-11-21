import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { StoryScene } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateStoryScene = async (
  history: string[], 
  userAction: string
): Promise<StoryScene> => {
  const ai = getAiClient();
  
  // Construct the prompt based on history
  const context = history.length > 0 
    ? `Previous story context: ${history.join("\n")}\n\nUser's latest action: ${userAction}`
    : `Start the adventure. ${userAction}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: context,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          choices: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          visualPrompt: { type: Type.STRING }
        },
        required: ["title", "description", "choices", "visualPrompt"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  try {
    return JSON.parse(text) as StoryScene;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("AI response was not valid JSON.");
  }
};

export const generateSceneImage = async (visualPrompt: string): Promise<string | null> => {
  const ai = getAiClient();
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: visualPrompt }]
      },
      config: {
        // No responseMimeType for image model
      }
    });

    // Iterate through parts to find the image data
    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
             return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.warn("Image generation failed:", error);
    return null;
  }
};