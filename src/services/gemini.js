// src/services/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// console.log("¿Mi Key existe?:", process.env.GEMINI_API_KEY ? "SÍ" : "NO");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { 
        temperature: 0.1, // Casi nada de creatividad = menos alucinaciones
        topP: 0.95,
    }
});

export async function generateAiResponse(prompt) {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error en la API de Gemini:", error);
        throw error;
    }
}