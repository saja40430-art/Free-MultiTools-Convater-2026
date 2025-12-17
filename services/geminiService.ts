import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ensure this is set in your environment
const ai = new GoogleGenAI({ apiKey });

export const generateAIResponse = async (prompt: string, model: string = 'gemini-2.5-flash') => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI. Please check API Key.";
  }
};

export const generateImageDescription = async (base64Image: string, mimeType: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType
                        }
                    },
                    {
                        text: "Analyze this image and describe it in detail."
                    }
                ]
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini Vision Error:", error);
        return "Failed to analyze image.";
    }
}
