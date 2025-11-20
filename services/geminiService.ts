import { GoogleGenAI } from "@google/genai";
import { CardData } from "../types";

const API_KEY = process.env.API_KEY || '';

export const getJokerAdvice = async (hand: CardData[], currentScore: number, target: number): Promise<string> => {
  if (!API_KEY) {
    return "Joker says: Config your API Key to hear my wisdom!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const handDescription = hand.map(c => `${c.rank} of ${c.suit}`).join(', ');
    
    const prompt = `
      You are a chaotic, witty, and slightly rude Joker character from a poker roguelike game (like Balatro).
      
      Context:
      - Player Hand: [${handDescription}]
      - Current Round Score: ${currentScore}
      - Target Score to Beat: ${target}
      
      Task:
      Analyze the hand quickly. Is there a flush? A straight? Pairs? Garbage?
      Give the player 1 very short sentence of advice or mockery. 
      Example: "Go for the flush, you coward." or "Two pair? Pathetic, but it might work."
      
      Keep it under 15 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "..." ;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Joker is sleeping (API Error)";
  }
};