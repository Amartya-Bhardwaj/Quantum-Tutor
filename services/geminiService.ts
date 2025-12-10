import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExplanation = async (topic: string, level: 'beginner' | 'advanced' = 'beginner'): Promise<string> => {
  try {
    const prompt = `Explain the concept of "${topic}" in the context of Quantum Computing. 
    Target audience: ${level === 'beginner' ? 'a curious high school student' : 'a computer science undergraduate'}. 
    Keep it concise (under 200 words), engaging, and use an analogy if possible.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate explanation.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered a quantum fluctuation (error) while retrieving that data. Please try again.";
  }
};

export const chatWithTutor = async (history: { role: string, text: string }[], message: string): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a friendly, intelligent Quantum Computing Tutor. Your goal is to make quantum mechanics and computing concepts accessible. Use metaphors (like coins, spheres, waves). Keep answers concise but accurate. If asked about non-quantum topics, politely steer back to physics or computing.",
            },
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.text }]
            }))
        });

        const result = await chat.sendMessage({ message });
        return result.text || "";
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "My wave function collapsed unexpectedly. Please try asking again.";
    }
}