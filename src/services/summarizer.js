// import { buildPrompt } from "../utils/prompt";
// import { generateText } from "./huggingface";

// export async function summarizeNews(newsText, readingMinutes = 5) {
//     const prompt = buildPrompt(newsText, readingMinutes);
//     const summary = await generateText(prompt);
//     return summary;
// }


import { generateText } from './huggingface.js';

/**
 * Recibe un array de noticias y genera un resumen por cada noticia,
 * y opcionalmente un resumen global de todas las noticias.
 *
 * @param {Array} newsArray - Cada noticia debe tener { title, summary }
 * @param {number} readingMinutes - Tiempo estimado de lectura por resumen
 * @returns {Object} { summarizedNews: Array, finalSummary: string }
 */
export async function summarizeAllNews(newsArray, readingMinutes = 5) {
  const summarizedNews = [];

  for (const news of newsArray) {
    const newsText = `${news.title}\n${news.summary}`;
    try {
      const summary = await generateText(newsText, readingMinutes);
      summarizedNews.push(summary);
    } catch (error) {
      console.error('Error resumiendo noticia:', news.title, error);
      summarizedNews.push(`Error resumiendo esta noticia: ${news.title}`);
    }
  }

  // Generar resumen global combinando los resúmenes individuales
  const combinedSummaries = summarizedNews.join('\n');
  let finalSummary = '';
  try {
    finalSummary = await generateText(combinedSummaries, readingMinutes);
  } catch (error) {
    console.error('Error generando resumen global:', error);
    finalSummary = 'No se pudo generar el resumen global.';
  }

  return { summarizedNews, finalSummary };
}
