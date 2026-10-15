/**
 * WARNING: This is a client-side prototype for translation.
 * Exposing your GEMINI_API_KEY in client-side code is a SECURITY RISK.
 * Anyone can steal your key and use your quota.
 * Use this ONLY for local prototyping/demos.
 */
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not set. Translation will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!apiKey) return text;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Translate the following text to ${targetLang}. Return ONLY the translated text, nothing else: "${text}"`,
  });
  
  return response.text?.trim() || text;
}

export async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  if (!apiKey || texts.length === 0) return texts;
  if (texts.length === 1) return [await translateText(texts[0], targetLang)];

  const prompt = `Translate the following list of strings to ${targetLang}. 
Return ONLY a JSON array of strings in the exact same order as the input. 
Do not include any other text or formatting.

Strings to translate:
${JSON.stringify(texts)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const resultText = response.text?.trim() || "";
    // Try to extract JSON if it's wrapped in code blocks
    const jsonMatch = resultText.match(/\[.*\]/s);
    const jsonString = jsonMatch ? jsonMatch[0] : resultText;
    
    const translatedArray = JSON.parse(jsonString);
    if (Array.isArray(translatedArray) && translatedArray.length === texts.length) {
      return translatedArray;
    }
    throw new Error("Invalid translation response format");
  } catch (error) {
    console.error("Batch translation failed:", error);
    return texts; // Fallback to original texts
  }
}
