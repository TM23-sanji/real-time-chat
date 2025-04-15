import { GoogleGenAI } from "@google/genai"; // Import the GoogleGenAI class from the @google/genai package

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_KEY as string });

export async function main(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return response.text;
}
