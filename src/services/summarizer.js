// import { buildPrompt } from "../utils/prompt";
// import { generateText } from "./huggingface";

// export async function summarizeNews(newsText, readingMinutes = 5) {
//     const prompt = buildPrompt(newsText, readingMinutes);
//     const summary = await generateText(prompt);
//     return summary;
// }


// import { generateText } from './huggingface.js';
// import { generateAiResponse } from './gemini.js';

/**
 * Recibe un array de noticias y genera un resumen por cada noticia,
 * y opcionalmente un resumen global de todas las noticias.
 *
//  * @param {Array} newsArray - Cada noticia debe tener { title, summary }
//  * @param {number} readingMinutes - Tiempo estimado de lectura por resumen
//  * @returns {Object} { summarizedNews: Array, finalSummary: string }
//  */
// export async function summarizeAllNews(newsArray, readingMinutes = 5) {
//   const summarizedNews = [];

//   for (const news of newsArray) {
//     const newsText = `${news.title}\n${news.summary}`;
//     try {
//       const summary = await generateText(newsText, readingMinutes);
//       summarizedNews.push(summary);
//     } catch (error) {
//       console.error('Error resumiendo noticia:', news.title, error);
//       summarizedNews.push(`Error resumiendo esta noticia: ${news.title}`);
//     }
//   }

//   // Generar resumen global combinando los resúmenes individuales
//   const combinedSummaries = summarizedNews.join('\n');
//   let finalSummary = '';
//   try {
//     finalSummary = await generateText(combinedSummaries, readingMinutes);
//   } catch (error) {
//     console.error('Error generando resumen global:', error);
//     finalSummary = 'No se pudo generar el resumen global.';
//   }

//   return { summarizedNews, finalSummary };
// }

// src/services/summarizer.js
import { generateAiResponse } from './gemini.js';

export async function summarizeAllNews(newsArray) {
    // 1. Preparamos un único bloque de texto con todas las noticias
    const context = newsArray.map((n, i) => 
        `NOTICIA ${i+1}:\nFuente: ${n.source}\nTítulo: ${n.title}\nContenido: ${n.summary}`
    ).join("\n\n---\n\n");

    // 2. Creamos un prompt de "Editor de Noticias"
    const prompt = `
    Actúa como un editor de noticias profesional. 
    Te proporcionaré una lista de noticias de diferentes fuentes.
    
    TU TAREA:
    1. Lee todas las noticias.
    2. Si varias fuentes hablan de lo mismo, unifícalas en un solo punto.
    3. Genera un resumen ejecutivo en ESPAÑOL con viñetas.
    4. Al final, añade una sección de "Tendencia" indicando cuál es el tema principal del día.

    REGLAS:
    - No inventes datos. 
    - Si la información es insuficiente, no rellenes con conocimiento previo.
    - Mantén un tono serio e informativo.

    NOTICIAS A PROCESAR:
    ${context}
    `;

    const finalSummary = await generateAiResponse(prompt);

    return { 
        summarizedNews: [], // Ya no necesitamos individuales si hacemos uno global potente
        finalSummary 
    };
}
