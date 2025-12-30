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

//-----------------------

// import { generateAiResponse } from './gemini.js';

// export async function summarizeAllNews(newsArray) {
//     console.log("Noticias recibidas:", newsArray);
//     // 1. Preparamos un único bloque de texto con todas las noticias
//     if (!newsArray || newsArray.length === 0) {
//         throw new Error("No se obtuvieron noticias de las fuentes RSS.");
//     }   

//     const context = newsArray.map((n, i) => 
//         `NOTICIA ${i+1}:\nFuente: ${n.source}\nTítulo: ${n.title}\nContenido: ${n.summary}`
//     ).join("\n\n---\n\n");

//     // 2. Creamos un prompt de "Editor de Noticias"
//     const prompt = `
//     Actúa como un editor de noticias profesional. 
//     Te proporcionaré una lista de noticias de diferentes fuentes.
    
//     TU TAREA:
//     1. Lee todas las noticias.
//     2. Si varias fuentes hablan de lo mismo, unifícalas en un solo punto.
//     3. Genera un resumen ejecutivo en ESPAÑOL con viñetas.
//     4. SELECCIÓN CRÍTICA: No resumas todo. Elige solo las 7-10 noticias más impactantes, relevantes o de mayor trascendencia social y política. Ignora notas de relleno.
//     5. JERARQUÍA: Comienza con la noticia más importante del día (la "portada").
//     6. CATEGORÍAS: Agrupa el resto en secciones claras (ej: Economía, Sociedad, Mundo).

//     REGLAS:
//     - No inventes datos. 
//     - Si la información es insuficiente, no rellenes con conocimiento previo.
//     - Mantén un tono serio e informativo pero ágil.

//     FORMATO DE SALIDA (Usa Markdown):
//     - Usa ### para los títulos de las secciones.
//     - Usa **negritas** para nombres propios, cifras o conceptos clave.
//     - Si hay una noticia urgente, márcala con "🚨".

//     NOTICIAS A PROCESAR:
//     ${context}
//     `;

//     const finalSummary = await generateAiResponse(prompt);

//     return { 
//         summarizedNews: [], // Ya no necesitamos individuales si hacemos uno global potente
//         finalSummary 
//     };
// }


//----------------------------------


import { getNewsOfTheDay } from './rss.js';
import { generateAiResponse } from './gemini.js';

/**
 * Coordina la extracción de noticias y su posterior resumen con IA.
 */
export async function summarizeAllNews() {
    console.log("--- [DEBUG] 1. Iniciando summarizeAllNews ---");
    
    let newsArray = [];

    try {
        console.log("--- [DEBUG] 2. Intentando obtener noticias desde RSS... ---");
        newsArray = await getNewsOfTheDay();
        
        // Verificamos qué llegó exactamente
        console.log("--- [DEBUG] 3. Resultado de newsArray:", newsArray);

    } catch (error) {
        console.error("--- [ERROR] Falló la extracción de noticias (RSS):", error.message);
        throw new Error("Error al conectar con las fuentes de noticias.");
    }

    // El "Seguro": Si newsArray es null, undefined o está vacío []
    if (!newsArray || !Array.isArray(newsArray) || newsArray.length === 0) {
        console.log("--- [DEBUG] 4. El array de noticias está vacío o no es válido ---");
        throw new Error("No se obtuvieron noticias de las fuentes RSS.");
    }

    try {
        console.log(`--- [DEBUG] 5. Enviando ${newsArray.length} noticias a Gemini... ---`);
        
        // Preparamos el contexto para la IA
        const context = newsArray
            .map((n, i) => `Noticia ${i + 1}:\nTítulo: ${n.title}\nFuente: ${n.source}\nLink: ${n.link}`)
            .join("\n\n---\n\n");

        const prompt = `
                TU TAREA:
        1. Lee todas las noticias.
        2. Si varias fuentes hablan de lo mismo, unifícalas en un solo punto.
        3. Genera un resumen ejecutivo en ESPAÑOL con viñetas.
        4. SELECCIÓN CRÍTICA: No resumas todo. Elige solo las 7-10 noticias más impactantes, relevantes o de mayor trascendencia social y política. Ignora notas de relleno.
        5. JERARQUÍA: Comienza con la noticia más importante del día (la "portada").
        6. CATEGORÍAS: Agrupa el resto en secciones claras (ej: Economía, Sociedad, Mundo).

        REGLAS:
        - No inventes datos. 
        - Si la información es insuficiente, no rellenes con conocimiento previo.
        - Mantén un tono serio e informativo pero ágil.

        FORMATO DE SALIDA (Usa Markdown):
        - Usa ### para los títulos de las secciones.
        - Usa **negritas** para nombres propios, cifras o conceptos clave.
        - Si hay una noticia urgente, márcala con "🚨".

        NOTICIAS A PROCESAR:
        ${context}
    `;

        const summary = await generateAiResponse(prompt);
        
        console.log("--- [DEBUG] 6. Resumen generado exitosamente ---");
        return { summary };

    } catch (error) {
        console.error("--- [ERROR] Falló la generación con Gemini:", error.message);
        throw error; // Re-lanzamos para que el index.js lo capture
    }
}