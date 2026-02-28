
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

// Expert styling advice service using the latest Gemini models
export async function getStylingAdvice(productName: string, category: string, occasion: string, lang: Language = 'en') {
  const langPrompt = lang === 'vi' ? "Hãy trả lời bằng tiếng Việt." : "Respond in English.";
  
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // Calling generateContent with gemini-3-pro-preview for complex reasoning tasks like styling consultation
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Provide expert styling advice for a ${productName} (Category: ${category}) for a ${occasion}. Focus on a minimalist, premium look consistent with T-kap Fashion aesthetics. ${langPrompt}`,
      config: {
        systemInstruction: "You are an elite T-kap Fashion luxury stylist. Your advice is brief, authoritative, and sophisticated.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestion: { type: Type.STRING },
            occasion: { type: Type.STRING },
            itemsToPair: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["suggestion", "occasion", "itemsToPair"]
        }
      }
    });

    const text = response.text; // Access text property directly as per latest SDK guidelines
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("AI Stylist Error:", error);
    return lang === 'vi' ? {
      suggestion: "Để duy trì phong cách T-kap Fashion, hãy kết hợp với các tông màu trung tính và phụ kiện tối giản.",
      occasion: occasion,
      itemsToPair: ["Giày da cao cấp", "Đồng hồ kim loại", "Thắt lưng đồng bộ"]
    } : {
      suggestion: "To maintain the T-kap Fashion aesthetic, pair this with neutral tones and minimalist accessories.",
      occasion: occasion,
      itemsToPair: ["Premium Leather Shoes", "Stainless Steel Watch", "Matching Belt"]
    };
  }
}
