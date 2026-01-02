import { getNewsOfTheDay } from './rss.js';
import { generateAiResponse } from './gemini.js';

/**
 * It coordinates news extarction and subsequent summarization with AI.
 */
export async function summarizeAllNews() {
    console.log("--- [DEBUG] 1. Iniciando summarizeAllNews ---");
    
    let newsArray = [];

    try {
        console.log("--- [DEBUG] 2. Intentando obtener noticias desde RSS... ---");
        newsArray = await getNewsOfTheDay();
        
        // We verificate what was arrived exactly
        console.log("--- [DEBUG] 3. Resultado de newsArray:", newsArray);

    } catch (error) {
        console.error("--- [ERROR] Falló la extracción de noticias (RSS):", error.message);
        throw new Error("Error al conectar con las fuentes de noticias.");
    }

    if (!newsArray || !Array.isArray(newsArray) || newsArray.length === 0) {
        console.log("--- [DEBUG] 4. El array de noticias está vacío o no es válido ---");
        throw new Error("No se obtuvieron noticias de las fuentes RSS.");
    }

    try {
        console.log(`--- [DEBUG] 5. Enviando ${newsArray.length} noticias a Gemini... ---`);
        
        // We prepare the context for the AI.
        const context = newsArray
            .map((n, i) => `Noticia ${i + 1}:\nTítulo: ${n.title}\nFuente: ${n.source}\nLink: ${n.link}`)
            .join("\n\n---\n\n");

        const prompt = `
        Eres un editor de cierre de un diario nacional. Tu tarea es crear un ÚNICO boletín informativo basado en las noticias proporcionadas. Tu objetivo es informar con DATOS, no con presentaciones vacías.

        NOTICIAS A PROCESAR:
        ${context}

        REGLAS DE ORO PARA EL CONTENIDO:
        1. Lee todas las noticias.
        2. Si varias fuentes hablan de lo mismo, unifícalas en un solo punto.
        3. SELECCIÓN CRÍTICA: No resumas todo. Elige solo las 7-10 noticias más trascendentes. Ignora notas de relleno.
        4. JERARQUÍA: Comienza con la noticia más importante del día (la "portada").
        5. CATEGORÍAS: Agrupa el resto en secciones claras (ej: Economía, Sociedad, Mundo).
        6. FUENTES: **LINKS OBLIGATORIOS**: Al final de cada noticia, añade el link REAL de cada una. 
        FORMATO DEL LINK: [Leer más en Fuente](URL_DEL_LINK_PROPORCIONADO)
        (Sustituye URL_DEL_LINK_PROPORCIONADO por el link correspondiente a esa noticia específica).
        7. NO hagas dos secciones de resumen. Haz una sola lista.
        8. PRECISIÓN DE ATRIBUCIÓN: No mezcles causas con alertas oficiales. Asegúrate de que las acciones de organismos (ej: SMN, BCRA) se vinculen estrictamente a su competencia. (Ejemplo: El SMN alerta por el clima, no por fallas eléctricas).
        9. PROHIBIDA LA REDUNDANCIA: No repitas el título en la descripción. Si el título dice "Aumento de nafta", la descripción debe decir cuánto aumenta, a partir de cuándo y por qué.
        10. DENSIDAD INFORMATIVA: Cada frase debe aportar un dato nuevo (nombres, cifras, porcentajes, lugares exactos). Si una noticia no tiene datos concretos, ignórala.
        11. FILTRO DE RELEVANCIA: Prioriza impacto Nacional. Ignora noticias locales menores (ej: multas en Córdoba, servicios locales) a menos que afecten a todo el país.
        12. ESTILO RESUMEN, NO INTRODUCCIÓN: No digas "Se informa sobre...", di directamente qué pasó. 
        - MAL: "Se informa sobre el horario de bancos." 
        - BIEN: "Los bancos operarán hasta las 11:00 AM por el asueto de fin de año."

        REGLAS:
        - No inventes datos. 
        - Si la información es insuficiente, no rellenes con conocimiento previo.
        - Mantén un tono serio e informativo pero ágil.
        - No des opiniones personales.
        - NO generes una introducción, ni un resumen previo.

        ### 📂 Categoría
        **Título de la noticia**
        Descripción de la noticia...
        [Leer más en Fuente](Link proporcionado)

        FORMATO DE SALIDA (Usa Markdown):
        - Usa ### para los títulos de las secciones.
        - Usa **negritas** para nombres propios, cifras o conceptos clave.
        - Si hay una noticia urgente, márcala con "🚨".
    `;

        const summary = await generateAiResponse(prompt);
        
        console.log("--- [DEBUG] 6. Resumen generado exitosamente ---");
        return { summary };

    } catch (error) {
        console.error("--- [ERROR] Falló la generación con Gemini:", error.message);
        throw error; // Re-released so that index.js captures it.
    }
}